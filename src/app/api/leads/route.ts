import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

// Schema de Validação Zod (Estrito)
const leadSchema = z.object({
  name: z.string().min(3, "Nome precisa ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail corporativo inválido").refine((email) => {
    // Rejeita e-mails gratuitos/pessoais
    const blockedDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];
    const domain = email.split('@')[1];
    return !blockedDomains.includes(domain);
  }, "Por favor, utilize seu e-mail corporativo"),
  company: z.string().min(2, "Nome da empresa é obrigatório")
});

// Tipos baseados no Schema
type Lead = z.infer<typeof leadSchema>;

// Handler da Rota POST /api/leads
export async function POST(request: Request) {
  try {
    // 1. Parse do Body
    const body = await request.json();

    // 2. Validação Zod
    const result = leadSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        errors: result.error.errors 
      }, { status: 400 });
    }

    // 3. Lead Validado
    const lead: Lead = result.data;

    // 4. Envio do E-mail (Via Resend)
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'leads@yesode.com.br',
      to: 'filipe@yesode.com.br',
      subject: `[LEAD B2B] Nova Solicitação de ${lead.company}`,
      html: `
        <h2>Novo Lead Corporativo</h2>
        <p><strong>Nome:</strong> ${lead.name}</p>
        <p><strong>E-mail:</strong> ${lead.email}</p>
        <p><strong>Empresa:</strong> ${lead.company}</p>
        <hr />
        <p><em>Lead capturado via Landing Page Yesode</em></p>
      `
    });

    // 5. Retorno de Sucesso
    return NextResponse.json({
      success: true,
      message: "Lead recebido com sucesso"
    });

  } catch (error: any) {
    console.error('[API Error]:', error);
    
    return NextResponse.json({
      success: false,
      message: "Erro interno no servidor"
    }, { status: 500 });
  }
}
