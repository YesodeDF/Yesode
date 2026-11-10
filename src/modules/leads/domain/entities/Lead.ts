import { CorporateEmail } from '../value-objects/CorporateEmail.ts';
import { DomainError } from '../exceptions/LeadErrors.ts';

export interface LeadProps {
  name: string;
  email: CorporateEmail;
  company: string;
  createdAt: Date;
}

export class Lead {
  private readonly _props: LeadProps;

  private constructor(props: LeadProps) {
    this._props = props;
  }

  public static create(raw: { name: string; email: string; company: string; createdAt?: Date }): Lead {
    const name = (raw.name || '').trim();
    if (!name) {
      throw new DomainError('Informe seu nome completo.');
    }
    if (name.length < 2) {
      throw new DomainError('O nome informado é muito curto.');
    }

    const company = (raw.company || '').trim();
    if (!company) {
      throw new DomainError('Informe a empresa.');
    }
    if (company.length < 2) {
      throw new DomainError('O nome da empresa é muito curto.');
    }

    const email = CorporateEmail.create(raw.email);

    return new Lead({
      name,
      email,
      company,
      createdAt: raw.createdAt || new Date(),
    });
  }

  public get name(): string {
    return this._props.name;
  }

  public get email(): CorporateEmail {
    return this._props.email;
  }

  public get company(): string {
    return this._props.company;
  }

  public get createdAt(): Date {
    return this._props.createdAt;
  }

  public toJSON() {
    return {
      name: this.name,
      email: this.email.value,
      company: this.company,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
