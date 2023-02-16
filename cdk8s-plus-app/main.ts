import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';
import { Deployment, Service, ServiceType } from 'cdk8s-plus-25';

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    const label = {app: 'rest-demo'};

    // define resources here

    new Deployment(this, 'deployment', {
      containers: [{image: 'sumughan124/flask-rest-demo:latest'}],
      replicas: 3,
      metadata: {
        labels: label,
        name: label.app
      }
    });

    new Service(this, 'service', {
      type: ServiceType.LOAD_BALANCER,
      ports: [ { port: 8000, targetPort: 5000 } ],
      metadata: {
        name: label.app
      }
    });
  }
}

const app = new App();
new MyChart(app, 'cdk8s-plus-app');
app.synth();