import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { QrCode, Link2, DollarSign, Download, Copy, Check, Sparkles, FileText } from 'lucide-react';
import { PixCharge } from '../../domain/entities/PixCharge.ts';
import { QrCanvasService } from '../../infrastructure/QrCanvasService.ts';
import './QrGeneratorWorkspace.scss';

type ActiveTab = 'link' | 'pix';

export const QrGeneratorWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('pix');
  const toast = useRef<Toast>(null);

  // Link State
  const [url, setUrl] = useState('https://yesode.com.br');
  const [linkQrDataUrl, setLinkQrDataUrl] = useState<string>('');

  // Pix State
  const [pixKey, setPixKey] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [merchantCity, setMerchantCity] = useState('SAO PAULO');
  const [amount, setAmount] = useState('');
  const [txId, setTxId] = useState('***');
  const [pixPayload, setPixPayload] = useState('');
  const [pixQrDataUrl, setPixQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Import Copy Paste Modal / State
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);

  // Generate URL QR on change
  useEffect(() => {
    if (activeTab === 'link' && url.trim()) {
      QrCanvasService.toDataUrl(url.trim(), { width: 360 })
        .then(setLinkQrDataUrl)
        .catch((err: unknown) => console.error('Erro gerando QR URL:', err));
    }
  }, [activeTab, url]);

  // Generate Pix QR on change
  const handleGeneratePix = () => {
    try {
      const charge = PixCharge.create({
        key: pixKey,
        merchantName,
        merchantCity,
        amount,
        txId,
      });
      const emv = charge.toEmvPayload();
      setPixPayload(emv);
      QrCanvasService.toDataUrl(emv, { width: 360 })
        .then(setPixQrDataUrl)
        .catch((err: unknown) => console.error('Erro renderizando Pix QR:', err));
    } catch (err: any) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Atenção na Validação',
        detail: err.message || 'Verifique os dados informados.',
        life: 4000,
      });
    }
  };

  const handleImportPix = () => {
    try {
      const parsed = PixCharge.parseFromCopyPaste(importText);
      setPixKey(parsed.key);
      setMerchantName(parsed.merchantName);
      setMerchantCity(parsed.merchantCity);
      if (parsed.amount) setAmount(parsed.amount);
      if (parsed.txId) setTxId(parsed.txId);
      setShowImport(false);
      setImportText('');

      // Auto-trigger generation
      const charge = PixCharge.create({
        key: parsed.key,
        merchantName: parsed.merchantName,
        merchantCity: parsed.merchantCity,
        amount: parsed.amount,
        txId: parsed.txId,
      });
      const emv = charge.toEmvPayload();
      setPixPayload(emv);
      QrCanvasService.toDataUrl(emv, { width: 360 }).then(setPixQrDataUrl);

      toast.current?.show({
        severity: 'success',
        summary: 'Pix Importado',
        detail: 'Dados e assinatura CRC16 verificados com sucesso!',
        life: 3000,
      });
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Código Inválido',
        detail: err.message,
        life: 5000,
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    toast.current?.show({
      severity: 'info',
      summary: 'Copiado',
      detail: 'Código Pix copiado para a área de transferência!',
      life: 2000,
    });
  };

  const downloadQr = (dataUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
  };

  return (
    <div className="ys-qr-workspace">
      <Toast ref={toast} position="bottom-right" />

      {/* Tabs */}
      <div className="ys-qr-tabs">
        <button
          className={`ys-qr-tab ${activeTab === 'pix' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('pix')}
        >
          <DollarSign size={18} />
          <span>Cobrança Pix Oficial</span>
        </button>
        <button
          className={`ys-qr-tab ${activeTab === 'link' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('link')}
        >
          <Link2 size={18} />
          <span>Link ou Texto</span>
        </button>
      </div>

      <div className="ys-qr-grid">
        {/* Left Card: Inputs */}
        <div className="ys-qr-card ys-qr-form-card">
          {activeTab === 'pix' ? (
            <>
              <div className="ys-qr-card-header">
                <div>
                  <h3 className="ys-qr-card-title">Cobrança Pix com QR Code</h3>
                  <p className="ys-qr-card-subtitle">
                    Gera o código oficial EMV® padrão Banco Central, com checksum CRC16. 100% privado no seu navegador.
                  </p>
                </div>
                <Button
                  className="p-button-outlined p-button-sm ys-btn-import"
                  onClick={() => setShowImport(!showImport)}
                  tooltip="Importar código Pix Copia e Cola existente"
                >
                  <FileText size={15} />
                  <span>Importar Pix</span>
                </Button>
              </div>

              {showImport && (
                <div className="ys-qr-import-box">
                  <label className="ys-field-label">Cole o código Pix Copia e Cola (000201...):</label>
                  <textarea
                    className="ys-qr-textarea"
                    rows={3}
                    placeholder="Cole aqui a string completa do Pix..."
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                  />
                  <div className="ys-qr-import-actions">
                    <Button
                      label="Cancelar"
                      className="p-button-text p-button-sm"
                      onClick={() => setShowImport(false)}
                    />
                    <Button
                      label="Decodificar e Carregar"
                      className="p-button-primary p-button-sm"
                      onClick={handleImportPix}
                    />
                  </div>
                </div>
              )}

              <div className="ys-qr-fields">
                <div className="ys-field">
                  <label className="ys-field-label">Chave Pix (CPF, E-mail, Telefone ou Aleatória) *</label>
                  <InputText
                    value={pixKey}
                    placeholder="Ex: financeiro@suaempresa.com.br ou 11999998888"
                    onChange={(e) => setPixKey(e.target.value)}
                  />
                </div>

                <div className="ys-fields-row">
                  <div className="ys-field">
                    <label className="ys-field-label">Nome do Beneficiário *</label>
                    <InputText
                      value={merchantName}
                      placeholder="Ex: JOAO SILVA"
                      onChange={(e) => setMerchantName(e.target.value)}
                    />
                  </div>
                  <div className="ys-field">
                    <label className="ys-field-label">Cidade *</label>
                    <InputText
                      value={merchantCity}
                      placeholder="Ex: SAO PAULO"
                      onChange={(e) => setMerchantCity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="ys-fields-row">
                  <div className="ys-field">
                    <label className="ys-field-label">Valor R$ (Opcional)</label>
                    <InputText
                      value={amount}
                      placeholder="Ex: 50.00"
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="ys-field">
                    <label className="ys-field-label">Identificador (TxID)</label>
                    <InputText
                      value={txId}
                      placeholder="Ex: PEDIDO123 ou ***"
                      onChange={(e) => setTxId(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  className="p-button-primary ys-qr-submit-btn"
                  onClick={handleGeneratePix}
                >
                  <Sparkles size={16} />
                  <span>Gerar QR Code Pix</span>
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="ys-qr-card-header">
                <div>
                  <h3 className="ys-qr-card-title">Gerador de QR Code para Link ou Texto</h3>
                  <p className="ys-qr-card-subtitle">
                    Gere instantaneamente um QR Code limpo, sem redirecionamentos intermediários ou anúncios.
                  </p>
                </div>
              </div>

              <div className="ys-qr-fields">
                <div className="ys-field">
                  <label className="ys-field-label">URL de Destino ou Texto</label>
                  <InputText
                    value={url}
                    placeholder="https://suaempresa.com.br"
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Card: Preview */}
        <div className="ys-qr-card ys-qr-preview-card">
          <h4 className="ys-preview-title">Resultado em Tempo Real</h4>

          <div className="ys-qr-canvas-wrapper">
            {(activeTab === 'pix' ? pixQrDataUrl : linkQrDataUrl) ? (
              <img
                src={activeTab === 'pix' ? pixQrDataUrl : linkQrDataUrl}
                alt="QR Code gerado"
                className="ys-qr-rendered-img"
              />
            ) : (
              <div className="ys-qr-placeholder">
                <QrCode size={64} opacity={0.3} />
                <span>Preencha os campos ao lado para gerar seu QR Code</span>
              </div>
            )}
          </div>

          {(activeTab === 'pix' ? pixQrDataUrl : linkQrDataUrl) && (
            <div className="ys-qr-preview-actions">
              <Button
                className="p-button-outlined ys-qr-download-btn"
                onClick={() =>
                  downloadQr(
                    activeTab === 'pix' ? pixQrDataUrl : linkQrDataUrl,
                    activeTab === 'pix' ? 'pix-qrcode-yesode.png' : 'qrcode-yesode.png'
                  )
                }
              >
                <Download size={16} />
                <span>Baixar Imagem PNG</span>
              </Button>
            </div>
          )}

          {activeTab === 'pix' && pixPayload && (
            <div className="ys-copia-cola-box">
              <div className="ys-copia-cola-header">
                <span>Código Copia e Cola:</span>
                <button
                  type="button"
                  className="ys-copy-btn"
                  onClick={() => copyToClipboard(pixPayload)}
                >
                  {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <textarea
                readOnly
                className="ys-copia-cola-text"
                rows={3}
                value={pixPayload}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
