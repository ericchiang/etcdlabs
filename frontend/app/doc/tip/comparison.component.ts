import { Component, AfterContentInit } from '@angular/core';
import { ParentComponent } from './common/common.component';

import { Http } from '@angular/http';
import { TesterMetricsService, TesterStatus, MetricsResponse } from './common/tester-metrics.service';

@Component({
    selector: 'app-comparison',
    templateUrl: 'comparison.component.html',
    styleUrls: ['common/common.component.css'],
    providers: [TesterMetricsService],
})
export class ComparisonTipComponent extends ParentComponent implements AfterContentInit {
    metricsLastUpdate: string;
    metricsSuccess: boolean;
    metricsResult: string;
    metricsErrorMessage: string;

    status3Node: TesterStatus;
    status3NodeFailpoints: TesterStatus;
    status5Node: TesterStatus;
    status5NodeFailpoints: TesterStatus;

    constructor(private metricsService: TesterMetricsService, private http: Http) {
        super();

        this.metricsLastUpdate = '';
        this.metricsSuccess = true;
        this.metricsResult = '';
        this.metricsErrorMessage = '';

        this.status3Node = new TesterStatus('3-node', 0, 0, 0);
        this.status3NodeFailpoints = new TesterStatus('3-node failpoints', 0, 0, 0);
        this.status5Node = new TesterStatus('5-node', 0, 0, 0);
        this.status5NodeFailpoints = new TesterStatus('5-node failpoints', 0, 0, 0);
    }

    ngAfterContentInit() {
        console.log('getting initial tester status');
        this.clickRefresh();
    }

    processMetricsResponse(resp: MetricsResponse) {
        this.metricsLastUpdate = resp.LastUpdate;
        this.metricsSuccess = resp.Success;
        this.metricsResult = resp.Result;

        for (let _i = 0; _i < resp.Statuses.length; _i++) {
            let status = resp.Statuses[_i];
            if (status.Name === '3-node') {
                this.status3Node = status;
            } else if (status.Name === '3-node-failpoints') {
                this.status3NodeFailpoints = status;
            } else if (status.Name === '5-node') {
                this.status5Node = status;
            } else if (status.Name === '5-node-failpoints') {
                this.status5NodeFailpoints = status;
            };
        }
    };

    clickRefresh() {
        let metricsResponse: MetricsResponse;
        this.metricsService.fetchMetrics().subscribe(
            fetchedMetrics => metricsResponse = fetchedMetrics,
            error => this.metricsErrorMessage = <any>error,
            () => this.processMetricsResponse(metricsResponse),
        );
    };
}
