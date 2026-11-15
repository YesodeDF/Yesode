import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { QrCode, Link2, DollarSign, Download, Copy, Check, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { PixCharge } from '../../domain/entities/PixCharge.ts';
import { QrCanvasService } from '../../infrastructure/QrCanvasService.ts';
import './QrGeneratorWorkspace.scss';

type ActiveTab = 'link' | 'pix';

export const QrGeneratorWorkspace: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ActiveTab>('pix');
  const toast = useRef<Toast>(null);

  const [url, setUrl] = useState('https://yesode.com');
  const [linkQrDataUrl, setLinkQrDataUrl] = useState<string>('');

  const [copyPasteInput, setCopyPasteInput] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [merchantCity, setMerchantCity] = useState('SAO PAULO');
  const [amount, setAmount] = useState('');
  const [txId, setTxId] = useState('***');
  const [pixPayload, setPixPayload] = useState('');
  const [pixQrDataUrl, setPixQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [autoDecodedSuccess, setAutoDecodedSuccess] = useState(false);

  useEffect(() => {
    if (activeTab === 'link' && url.trim()) {
      QrCanvasService.toDataUrl(url.trim(), { width: 360 })
        .then(setLinkQrDataUrl)
        .catch((err: unknown) => console.error('QR URL error:', err));
    }
  }, [activeTab, url]);

  const resolveErrorMessage = (err: any, fallbackKey: string): string => {
    if (err?.code) {
      const translated = t(`tools.errors.${err.code}`, { defaultValue: '' });
      if (translated) return translated;
    }
    return err?.message || t(fallbackKey);
  };

  const handleCopyPasteChange = (val: string) => {
    setCopyPasteInput(val);
    const clean = (val || '').trim().replace(/\s+/g, '');

    if (clean.startsWith('000201') && clean.length > 25) {
      try {
        const parsed = PixCharge.parseFromCopyPaste(clean);
        setPixKey(parsed.key);
        if (parsed.merchantName) setMerchantName(parsed.merchantName);
        if (parsed.merchantCity) setMerchantCity(parsed.merchantCity);
        if (parsed.amount) setAmount(parsed.amount);
        if (parsed.txId) setTxId(parsed.txId);

        setPixPayload(clean);
        QrCanvasService.toDataUrl(clean, { width: 360 }).then(setPixQrDataUrl);

        setAutoDecodedSuccess(true);
        toast.current?.show({
          severity: 'success',
          summary: t('tools.qr.toast_decoded_summary'),
          detail: t('tools.qr.toast_decoded_detail'),
          life: 3000,
        });
      } catch {
        setAutoDecodedSuccess(false);
      }
    } else {
      setAutoDecodedSuccess(false);
    }
  };

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
      setCopyPasteInput(emv);
      QrCanvasService.toDataUrl(emv, { width: 360 })
        .then(setPixQrDataUrl)
        .catch((err: unknown) => console.error('Pix QR error:', err));

      toast.current?.show({
        severity: 'success',
        summary: t('tools.qr.toast_generated_summary'),
        detail: t('tools.qr.toast_generated_detail'),
        life: 3000,
      });
    } catch (err: any) {
      toast.current?.show({
        severity: 'warn',
        summary: t('tools.qr.toast_warn_summary'),
        detail: resolveErrorMessage(err, 'tools.qr.toast_warn_fallback'),
        life: 4000,
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    toast.current?.show({
      severity: 'info',
      summary: t('tools.qr.toast_copied_summary'),
      detail: t('tools.qr.toast_copied_detail'),
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

      <div className="ys-qr-tabs">
        <button
          className={`ys-qr-tab ${activeTab === 'pix' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('pix')}
        >
          <DollarSign size={18} />
          <span>{t('tools.qr.tab_pix')}</span>
        </button>
        <button
          className={`ys-qr-tab ${activeTab === 'link' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('link')}
        >
          <Link2 size={18} />
          <span>{t('tools.qr.tab_link')}</span>
        </button>
      </div>

      <div className="ys-qr-grid">
        <div className="ys-qr-card ys-qr-form-card">
          {activeTab === 'pix' ? (
            <>
              <div className="ys-qr-card-header">
                <div>
                  <h3 className="ys-qr-card-title">{t('tools.qr.pix_title')}</h3>
                  <p className="ys-qr-card-subtitle">{t('tools.qr.pix_subtitle')}</p>
                </div>
              </div>

              <div className="ys-qr-direct-paste-box">
                <div className="ys-direct-paste-header">
                  <label className="ys-field-label" htmlFor="pix-copia-cola-input">
                    <FileText size={15} />
                    <span>{t('tools.qr.paste_label')}</span>
                  </label>
                  {autoDecodedSuccess && (
                    <span className="ys-decoded-badge">
                      <CheckCircle2 size={13} color="#10B981" /> {t('tools.qr.decoded_badge')}
                    </span>
                  )}
                </div>
                <textarea
                  id="pix-copia-cola-input"
                  className="ys-qr-textarea"
                  rows={2}
                  placeholder={t('tools.qr.paste_placeholder')}
                  value={copyPasteInput}
                  onChange={(e) => handleCopyPasteChange(e.target.value)}
                />
              </div>

              <div className="ys-qr-divider">
                <span>{t('tools.qr.divider')}</span>
              </div>

              <div className="ys-qr-fields">
                <div className="ys-field">
                  <label className="ys-field-label">{t('tools.qr.key_label')}</label>
                  <InputText
                    value={pixKey}
                    placeholder={t('tools.qr.key_placeholder')}
                    onChange={(e) => setPixKey(e.target.value)}
                  />
                </div>

                <div className="ys-fields-row">
                  <div className="ys-field">
                    <label className="ys-field-label">{t('tools.qr.merchant_label')}</label>
                    <InputText
                      value={merchantName}
                      placeholder={t('tools.qr.merchant_placeholder')}
                      onChange={(e) => setMerchantName(e.target.value)}
                    />
                  </div>
                  <div className="ys-field">
                    <label className="ys-field-label">{t('tools.qr.city_label')}</label>
                    <InputText
                      value={merchantCity}
                      placeholder={t('tools.qr.city_placeholder')}
                      onChange={(e) => setMerchantCity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="ys-fields-row">
                  <div className="ys-field">
                    <label className="ys-field-label">{t('tools.qr.amount_label')}</label>
                    <InputText
                      value={amount}
                      placeholder={t('tools.qr.amount_placeholder')}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="ys-field">
                    <label className="ys-field-label">{t('tools.qr.txid_label')}</label>
                    <InputText
                      value={txId}
                      placeholder={t('tools.qr.txid_placeholder')}
                      onChange={(e) => setTxId(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  className="p-button-primary ys-qr-submit-btn"
                  onClick={handleGeneratePix}
                >
                  <Sparkles size={16} />
                  <span>{t('tools.qr.generate_btn')}</span>
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="ys-qr-card-header">
                <div>
                  <h3 className="ys-qr-card-title">{t('tools.qr.link_title')}</h3>
                  <p className="ys-qr-card-subtitle">{t('tools.qr.link_subtitle')}</p>
                </div>
              </div>

              <div className="ys-qr-fields">
                <div className="ys-field">
                  <label className="ys-field-label">{t('tools.qr.link_label')}</label>
                  <InputText
                    value={url}
                    placeholder={t('tools.qr.link_placeholder')}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="ys-qr-card ys-qr-preview-card">
          <h4 className="ys-preview-title">{t('tools.qr.preview_title')}</h4>

          <div className="ys-qr-canvas-wrapper">
            {(activeTab === 'pix' ? pixQrDataUrl : linkQrDataUrl) ? (
              <img
                src={activeTab === 'pix' ? pixQrDataUrl : linkQrDataUrl}
                alt={t('tools.qr.preview_alt')}
                className="ys-qr-rendered-img"
              />
            ) : (
              <div className="ys-qr-placeholder">
                <QrCode size={64} opacity={0.3} />
                <span>{t('tools.qr.preview_placeholder')}</span>
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
                <span>{t('tools.qr.download_png')}</span>
              </Button>
            </div>
          )}

          {activeTab === 'pix' && pixPayload && (
            <div className="ys-copia-cola-box">
              <div className="ys-copia-cola-header">
                <span>{t('tools.qr.copy_paste_label')}</span>
                <button
                  type="button"
                  className="ys-copy-btn"
                  onClick={() => copyToClipboard(pixPayload)}
                >
                  {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                  <span>{copied ? t('tools.qr.copied') : t('tools.qr.copy')}</span>
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
