import React, { useState } from 'react';
import {
  X,
  Ship,
  TrendingUp,
  TrendingDown,
  Globe,
  DollarSign,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  Sliders,
  ShieldCheck,
  Building,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  Percent,
  Sparkles,
  Plane,
  Package,
} from 'lucide-react';
import { PrefeitoCityState, TradeCommodity } from '../../types/textGame';
import { sounds } from '../../audio/soundManager';

interface TradeBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: PrefeitoCityState;
  onUpdateVolume: (commodityId: string, delta: number) => void;
  onToggleCommodity: (commodityId: string) => void;
  onSetTariffRate: (ratePercent: number) => void;
  onExecuteForexAuction: () => void;
  onSignPartnerAgreement: (partnerId: string) => void;
}

export const TradeBalanceModal: React.FC<TradeBalanceModalProps> = ({
  isOpen,
  onClose,
  state,
  onUpdateVolume,
  onToggleCommodity,
  onSetTariffRate,
  onExecuteForexAuction,
  onSignPartnerAgreement,
}) => {
  const [activeTab, setActiveTab] = useState<'commodities' | 'tariff' | 'partners' | 'forex'>('commodities');
  const [commodityFilter, setCommodityFilter] = useState<'all' | 'export' | 'import'>('all');
  const [tariffInput, setTariffInput] = useState<number>(
    state.tradeBalance?.importTariffAveragePercent || 12
  );
  const [notification, setNotification] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const trade = state.tradeBalance || {
    commodities: [],
    partners: [],
    totalExportUsd: 0,
    totalImportUsd: 0,
    netTradeBalanceUsd: 0,
    netTradeBalanceBrl: 0,
    forexReservesUsd: 1250000,
    dollarExchangeRate: 5.42,
    importTariffAveragePercent: 12,
  };

  const dollarRate = trade.dollarExchangeRate || 5.42;
  const isSurplus = trade.netTradeBalanceUsd >= 0;

  const commodities = trade.commodities || [];
  const filteredCommodities = commodities.filter((c) => {
    if (commodityFilter === 'all') return true;
    return c.type === commodityFilter;
  });

  const totalExportsUsd = trade.totalExportUsd || 0;
  const totalImportsUsd = trade.totalImportUsd || 0;

  const handleApplyTariff = () => {
    sounds.playClick();
    onSetTariffRate(tariffInput);
    setNotification({
      text: `Alíquota média do Imposto de Importação ajustada para ${tariffInput}% com sucesso!`,
      success: true,
    });
  };

  const handleForexAuction = () => {
    sounds.playCash();
    onExecuteForexAuction();
    setNotification({
      text: `Leilão cambial concluído! O Banco Central liquidou reservas e injetou divisas no Tesouro Nacional!`,
      success: true,
    });
  };

  const handleSignAgreement = (partnerId: string, partnerName: string) => {
    sounds.playCash();
    onSignPartnerAgreement(partnerId);
    setNotification({
      text: `Tratado de Livre Comércio ratificado com ${partnerName}! Demanda de exportação aquecida!`,
      success: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/30 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header da Balança Comercial */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950/40 p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-inner">
              <Ship className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                  Balança Comercial & Comércio Exterior
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/20 border border-sky-400/40 text-sky-300">
                  Câmara de Comércio Exterior (CAMEX)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Gerencie exportações e importações da República, equilibre a taxa cambial e maximize os lucros em divisas soberanas.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Notificação Toast */}
        {notification && (
          <div
            className={`px-4 py-2 text-xs sm:text-sm font-semibold flex items-center justify-between transition-all ${
              notification.success
                ? 'bg-emerald-950 text-emerald-300 border-b border-emerald-800'
                : 'bg-rose-950 text-rose-300 border-b border-rose-800'
            }`}
          >
            <span>{notification.text}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-xs underline hover:text-white ml-3"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Painel Macro: Dólar, Superávit e Reservas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/60 border-b border-slate-800 text-xs">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>Saldo da Balança</span>
              {isSurplus ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              ) : (
                <ArrowDownLeft className="w-4 h-4 text-rose-400" />
              )}
            </div>
            <div className={`text-lg font-black ${isSurplus ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isSurplus ? '+' : ''}US$ {(trade.netTradeBalanceUsd).toLocaleString()}
            </div>
            <div className="text-[11px] font-semibold text-slate-300 mt-0.5">
              ≈ {isSurplus ? '+' : ''}R$ {(trade.netTradeBalanceBrl).toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {isSurplus ? 'Superávit Comercial Líquido' : 'Déficit Comercial da Nação'}
            </div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>Câmbio Ptax (USD/BRL)</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-lg font-black text-amber-300">
              R$ {dollarRate.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Cotação Comercial do Banco Central
            </div>
            <div className="text-[10px] text-emerald-400 mt-1">
              Dólar alto bonifica exportadores nacionais
            </div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>Reservas Internacionais</span>
              <Coins className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-lg font-black text-sky-300">
              US$ {(trade.forexReservesUsd || 1250000).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Cofre Cambial Soberano
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Disponível para Leilões do Banco Central
            </div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>Tarifa Média de Importação</span>
              <Percent className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-lg font-black text-indigo-300">
              {trade.importTariffAveragePercent || 12}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Arrecadação Aduaneira Federal
            </div>
            <div className="text-[10px] text-indigo-400 mt-1">
              Fixada pelo Conselho da CAMEX
            </div>
          </div>
        </div>

        {/* Tabs de Navegação */}
        <div className="p-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-900/40">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('commodities')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'commodities'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Pauta de Mercadorias ({commodities.length})
            </button>
            <button
              onClick={() => setActiveTab('tariff')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'tariff'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-indigo-300 hover:bg-slate-700'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Regulamentação Tarifária (CAMEX)
            </button>
            <button
              onClick={() => setActiveTab('partners')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'partners'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-800 text-sky-300 hover:bg-slate-700'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Parceiros Globais & Tratados
            </button>
            <button
              onClick={() => setActiveTab('forex')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'forex'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              Leilão Cambial (Banco Central)
            </button>
          </div>

          {activeTab === 'commodities' && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCommodityFilter('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                  commodityFilter === 'all'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setCommodityFilter('export')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 ${
                  commodityFilter === 'export'
                    ? 'bg-emerald-900 text-emerald-300 font-bold border border-emerald-600/40'
                    : 'text-slate-400 hover:text-emerald-300'
                }`}
              >
                <ArrowUpRight className="w-3 h-3" /> Exportações
              </button>
              <button
                onClick={() => setCommodityFilter('import')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 ${
                  commodityFilter === 'import'
                    ? 'bg-rose-900 text-rose-300 font-bold border border-rose-600/40'
                    : 'text-slate-400 hover:text-rose-300'
                }`}
              >
                <ArrowDownLeft className="w-3 h-3" /> Importações
              </button>
            </div>
          )}
        </div>

        {/* Conteúdo Principal */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: COMMODITIES */}
          {activeTab === 'commodities' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>
                  Fluxos vigentes: Total Exportações US$ {totalExportsUsd.toLocaleString()} | Total Importações US$ {totalImportsUsd.toLocaleString()}
                </span>
                <span className="text-amber-400 font-semibold">
                  Ajuste o volume contratado (+ / -) para aumentar superávit ou conter custos.
                </span>
              </div>

              {filteredCommodities.map((item) => {
                const itemTotalUsd = Math.round((item.currentVolume * item.internationalPriceUsd) / 1000);
                const itemTotalBrl = Math.round(itemTotalUsd * dollarRate);

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all ${
                      item.active
                        ? item.type === 'export'
                          ? 'bg-slate-900/90 border-emerald-500/40'
                          : 'bg-slate-900/90 border-indigo-500/40'
                        : 'bg-slate-950/40 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xl">{item.icon}</span>
                          <h3 className="text-base font-bold text-slate-100">
                            {item.name}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-black uppercase ${
                              item.type === 'export'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                                : 'bg-indigo-950 text-indigo-300 border border-indigo-600/40'
                            }`}
                          >
                            {item.type === 'export' ? 'Exportação Soberana' : 'Importação Estratégica'}
                          </span>
                          <span className="text-xs text-slate-400">
                            • Cotação: US$ {item.internationalPriceUsd.toLocaleString()} / {item.unit}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span>
                            Mercados Parceiros: <strong className="text-slate-200">{item.partnerMarkets.join(', ')}</strong>
                          </span>
                          {item.tariffApplicablePercent ? (
                            <span>
                              Tarifa Aplicável: <strong className="text-amber-400">{item.tariffApplicablePercent}%</strong>
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* Controle de Volume e Totalizador */}
                      <div className="sm:w-72 flex flex-col justify-between items-end gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                        <div className="w-full flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">Volume Contratado:</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                sounds.playClick();
                                onUpdateVolume(item.id, -item.baseVolumePerCycle * 0.2);
                              }}
                              className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-200 transition-colors"
                              title="Reduzir Volume"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>

                            <span className="font-mono text-xs font-bold text-amber-300 px-1">
                              {item.currentVolume.toLocaleString()} {item.unit}
                            </span>

                            <button
                              onClick={() => {
                                sounds.playClick();
                                onUpdateVolume(item.id, item.baseVolumePerCycle * 0.2);
                              }}
                              className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-200 transition-colors"
                              title="Expandir Volume"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="w-full pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                          <span className="text-slate-400">
                            {item.type === 'export' ? 'Receita em Dólar:' : 'Custo em Dólar:'}
                          </span>
                          <span
                            className={`font-black ${
                              item.type === 'export' ? 'text-emerald-400' : 'text-indigo-300'
                            }`}
                          >
                            US$ {itemTotalUsd.toLocaleString()} (≈ R$ {itemTotalBrl.toLocaleString()})
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            sounds.playClick();
                            onToggleCommodity(item.id);
                          }}
                          className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                            item.active
                              ? 'bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-600/40'
                              : 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-sm'
                          }`}
                        >
                          {item.active ? 'Suspender Operação' : 'Reativar Fluxo'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: TARIFA CAMEX */}
          {activeTab === 'tariff' && (
            <div className="space-y-6 max-w-3xl mx-auto p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-400" />
                  Alíquota Média do Imposto de Importação (II)
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                  Defina a taxa alfandegária média aplicada sobre mercadorias estrangeiras que ingressam no país pelos portos e aeroportos federais.
                </p>
              </div>

              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300">Alíquota CAMEX Fixada:</span>
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    {tariffInput}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  value={tariffInput}
                  onChange={(e) => setTariffInput(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />

                <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono">
                  <span>0% (Livre Importação Total)</span>
                  <span>15% (Tarifa Moderada)</span>
                  <span>40% (Protecionismo Severo)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/40">
                  <h4 className="font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> Vantagens de Tarifas Maiores ({tariffInput}%)
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    <li>• Arrecadação direta de divisas alfandegárias para o Tesouro.</li>
                    <li>• Estimula a indústria nacional a produzir no Brasil em vez de importar.</li>
                    <li>• Reduz o déficit comercial ao conter o consumo de supérfluos externos.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-700/40">
                  <h4 className="font-bold text-rose-300 mb-1 flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4 text-rose-400" /> Riscos de Tarifas Excessivas
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    <li>• Encarece fertilizantes para o agronegócio e semicondutores para indústrias.</li>
                    <li>• Eleva os preços de remédios importados e insumos hospitalares do SUS.</li>
                    <li>• Pode gerar retaliação de parceiros comerciais como China e União Europeia.</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={handleApplyTariff}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg"
              >
                Publicar Nova Alíquota no Diário Oficial da União (DOU)
              </button>
            </div>
          )}

          {/* TAB 3: PARCEIROS GLOBAIS */}
          {activeTab === 'partners' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                A diplomacia comercial do Itamaraty permite assinar Acordos de Livre Comércio com os maiores blocos econômicos do planeta, expandindo a pauta de exportações.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(trade.partners || []).map((partner) => {
                  const isFreeTrade = partner.tradeStatus === 'livre_comercio';

                  return (
                    <div
                      key={partner.id}
                      className={`p-4 sm:p-5 rounded-xl border transition-all ${
                        isFreeTrade
                          ? 'bg-slate-900/90 border-emerald-500/50'
                          : 'bg-slate-900/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{partner.flag}</span>
                          <div>
                            <h4 className="font-bold text-slate-100 text-base">{partner.countryName}</h4>
                            <span className="text-xs text-slate-400">{partner.bloc}</span>
                          </div>
                        </div>

                        {isFreeTrade ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-950 text-emerald-300 border border-emerald-600/40 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Tratado Ratificado
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400">
                            Comércio Geral
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 text-xs text-slate-300 my-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Exportações Nacionais:</span>
                          <span className="text-emerald-400 font-semibold">{partner.topPurchases.join(', ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Importamos de Lá:</span>
                          <span className="text-sky-300 font-semibold">{partner.topSupplies.join(', ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Bônus de Demanda Externa:</span>
                          <span className="text-amber-400 font-bold">+{partner.exportDemandBoostPercent}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Desconto Tarifário Mútuo:</span>
                          <span className="text-indigo-300 font-bold">-{partner.tariffDiscountPercent}%</span>
                        </div>
                      </div>

                      {isFreeTrade ? (
                        <div className="py-2 px-3 rounded-lg bg-emerald-950/60 border border-emerald-600/30 text-emerald-300 text-xs text-center font-semibold">
                          Acordo bilateral em vigor com tarifas preferenciais mútuas.
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSignAgreement(partner.id, partner.countryName)}
                          className="w-full py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          Ratificar Acordo de Livre Comércio Bilateral
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: LEILÃO CAMBIAL */}
          {activeTab === 'forex' && (
            <div className="space-y-6 max-w-3xl mx-auto p-5 bg-slate-950/50 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  Mesa de Operações de Câmbio do Banco Central
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                  Venda parte das reservas cambiais em dólares do país na cotação spot alta para transformar divisas internacionais em bilhões de reais diretamente no Tesouro Nacional.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="text-slate-400 mb-1">Reservas Cambiais Disponíveis</div>
                  <div className="text-2xl font-black text-sky-400 font-mono">
                    US$ {(trade.forexReservesUsd || 1250000).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Cofre em moeda forte administrado pelo BACEN
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="text-slate-400 mb-1">Cotação Atual de Venda</div>
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    R$ {dollarRate.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-1">
                    Câmbio favorável para liquidação soberana
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-300">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-sm">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Operação de Leilão de Linha: US$ 250.000
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Ao acionar a mesa de operações, o Banco Central liquidará US$ 250.000 das reservas e creditará{' '}
                  <strong className="text-emerald-400">
                    +R$ {Math.round(250000 * dollarRate).toLocaleString()}
                  </strong>{' '}
                  imediatamente no caixa do Tesouro Nacional para obras, saúde e pagamento de dívida pública.
                </p>
              </div>

              <button
                onClick={handleForexAuction}
                disabled={(trade.forexReservesUsd || 1250000) < 300000}
                className={`w-full py-3 font-black rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
                  (trade.forexReservesUsd || 1250000) >= 300000
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                Executar Leilão Cambial & Injetar +R${' '}
                {Math.round(250000 * dollarRate).toLocaleString()} no Tesouro
              </button>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
            <span>
              Portos e aduanas federais integrados ao Sistema Integrado de Comércio Exterior (SISCOMEX).
            </span>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors"
          >
            Fechar Balança Comercial
          </button>
        </div>
      </div>
    </div>
  );
};
