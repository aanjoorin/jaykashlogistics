declare module 'std/http/server' {
  export function serve(handler: (req: Request) => Promise<Response>): void;
}

declare module 'stripe' {
  export default class Stripe {
    constructor(secretKey: string, options?: { apiVersion: string });
    paymentIntents: {
      create(params: any): Promise<any>;
      retrieve(id: string): Promise<any>;
    };
    webhooks: {
      constructEvent(payload: string, signature: string, secret: string): any;
    };
  }
}

declare module '@supabase/supabase-js' {
  export function createClient(url: string, key: string): any;
}

declare module '@emailjs/browser' {
  export function send(serviceId: string, templateId: string, data: any, options?: any): Promise<any>;
  export default { send };
}