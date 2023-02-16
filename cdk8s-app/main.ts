import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';
import { IntOrString, KubeDeployment, KubeService } from './imports/k8s';

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    const label = { app: 'rest-demo'};

    // define resources here

    new KubeDeployment(this, 'deployment', {
      spec: {
        replicas: 3,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: { 
            name: 'rest-demo',
            labels: label
          },
          spec: {
            containers: [
              {
                name: 'rest-demo',
                image: 'sumughan124/rest-demo:latest',
                ports: [ { containerPort: 5000 }]
              }
            ]
          }
        }
      }
    });

    new KubeService(this, 'service', {
      spec: {
        type: 'LoadBalancer',
        ports: [ { port: 8000, targetPort: IntOrString.fromNumber(5000) } ],
        selector: label
      },
      metadata: { name: 'rest-demo-service' }
    });
  }
}

const app = new App();
new MyChart(app, 'deployment+service');
app.synth();
