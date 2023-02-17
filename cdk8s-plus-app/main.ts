import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';
import { Deployment, ServiceType } from 'cdk8s-plus-25';

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    const label = {app: 'rest-demo'};

    // define resources here
    new Deployment(this, 'deployment', {
      containers: [ { image: 'sumughan124/flask-rest-demo:latest', portNumber: 5000 } ],
      replicas: 3,
      metadata: {
        labels: label,
      }
    }).exposeViaService({
      serviceType: ServiceType.LOAD_BALANCER,
      ports: [ { port: 8000, targetPort: 5000 } ],
    });
  }
}

const app = new App();
new MyChart(app, 'cdk8s-plus-app');
app.synth();