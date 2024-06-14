import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { URL } from 'url';
import fetch, { Headers, RequestInit, Response } from 'node-fetch';

@Injectable()
export class AppService {
  private readonly subdomain: string;
  private readonly accessToken: string;

  constructor(private readonly configService: ConfigService) {
    this.subdomain = this.configService.get<string>('SUBDOMAIN');
    this.accessToken = this.configService.get<string>('ACCESS_TOKEN');
  }

  private async sendRequest(urlTail: string, searchParams: [string, string][]): Promise<Response> {
    const url = new URL(`https://${this.subdomain}.amocrm.ru/api/v4${urlTail}`);

    for (const param of searchParams) {
      url.searchParams.append(param[0], param[1]);
    }

    const headers = new Headers([['Authorization', `Bearer ${this.accessToken}`]]);

    const requestInit: RequestInit = {
      headers
    };

    return await fetch(url, requestInit);
  }

  private async getLeads(query?: string): Promise<Lead[]> {
    const searchParams: [string, string] [] = [['with', 'contacts']];
    if (query) {
      searchParams.push(['query', query]);
    } 
    const response = await this.sendRequest('/leads', searchParams);
    try {
      const obj = await response.json() as LeadsResponse;
      return obj._embedded.leads;
    }
    catch (err) {
      return [];
    }
  }

  private async getPipelines(): Promise<Pipeline[]> {
    const response = await this.sendRequest('/leads/pipelines', []);
    try {
      const obj = await response.json() as PipelinesResponse;
      return obj._embedded.pipelines;
    }
    catch (err) {
      return [];
    }
  }

  private async getResponsible(): Promise<User[]> {
    const response = await this.sendRequest('/users', []);
    try {
      const obj = await response.json() as UsersResponse;
      return obj._embedded.users;
    }
    catch (err) {
      return [];
    }
  }

  async getLeadResponse(query?: string): Promise<LeadResponse[]> {
    const leads = await this.getLeads(query);
    if(!leads.length) {
      return [];
    }

    const pipelines = await this.getPipelines();
    const pipelineStatusNamesById: Record<number, Record<number, string>> = {};
    for (const pipeline of pipelines) {
      pipelineStatusNamesById[pipeline.id] = {};
      for (const status of pipeline._embedded.statuses) {
        pipelineStatusNamesById[pipeline.id][status.id] = status.name;
      }
    }

    const users = await this.getResponsible();
    const userNameById: Record<number, string> = {};

    for (const user of users) {
      userNameById[user.id] = user.name;
    }

    const leadViews: LeadResponse[] = [];
    for (const lead of leads) {
      leadViews.push({
        ...lead,
        responsible_name: userNameById[lead.responsible_user_id],
        status: pipelineStatusNamesById[lead.pipeline_id][lead.status_id]
      });
    }

    return leadViews;
  }
}
