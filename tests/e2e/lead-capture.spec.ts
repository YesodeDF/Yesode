import { test, expect } from '@playwright/test';

test.describe('Fluxo de Conversão B2B - Consultoria Gratuita', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the localized testing URL
    await page.goto('http://localhost:5173');
  });

  test('Deve renderizar os inputs vitais e interagir sem Hydration Errors', async ({ page }) => {
    
    // 1. Semantic Check - Localizando o Container do Formulário B2B
    const formContainer = page.locator('.ys-capture-box');
    await expect(formContainer).toBeVisible();

    const title = formContainer.locator('h2');
    await expect(title).toHaveText('Vamos mapear o seu próximo passo.');

    // 2. Hydration & Integrity Check 
    const inputNome = page.getByPlaceholder('Nome Completo');
    const inputEmail = page.getByPlaceholder('E-mail Corporativo');
    const inputEmpresa = page.getByPlaceholder('Empresa');
    const btnSubmit = page.getByRole('button', { name: /Solicitar Consultoria Estratégica/i });

    // Validate DOM readiness
    await expect(inputNome).toBeVisible();
    await expect(inputEmail).toBeVisible();
    await expect(inputEmpresa).toBeVisible();
    await expect(btnSubmit).toBeEnabled();

    // 3. E2E Interaction Pipeline
    await inputNome.fill('Filipe Nogueira');
    await inputEmail.fill('filipe@yesode.com');
    await inputEmpresa.fill('Yesode Enterprise');
    
    // We expect the react state to successfully bind without throwing Client Errors, checking console output.
    const consolePromise = page.waitForEvent('console', msg => msg.text().includes('Lead Captured'));
    await btnSubmit.click();
    
    const consoleMessage = await consolePromise;
    expect(consoleMessage.text()).toContain('Filipe');
  });

});
