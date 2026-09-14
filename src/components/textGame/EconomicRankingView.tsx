import React, { useState, useEffect } from 'react';
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Building2,
  Users,
  Coins,
  ShieldCheck,
  Award,
  RefreshCw,
  Landmark,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CloudCheck,
  CheckCircle2,
} from 'lucide-react';
import { PrefeitoCityState, RegionalMayorProfile } from '../../types/textGame';
import { sounds } from '../../audio/soundManager';

interface EconomicRankingViewProps {
  cityState: PrefeitoCityState;
  otherMayors: Record<string, RegionalMayorProfile>;
  onOpenLoansWithCity: (cityName: string, mayorName: string) => void;
  onOpenMultiplayer: () => void;
}

export interface CityRankingEntry {
  cityName: string;
  mayorName: string;
  party: string;
  treasury: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  netMonthly: number;
  population: number;
  jobs: number;
  unemploymentRate: number;
  fiscalRating: string;
  approvalRating: number;
  securityIndex: number;
  healthIndex: number;
  educationIndex: number;
  infrastructureIndex: number;
  savedAt: number;
}

export const EconomicRankingView: React.FC<EconomicRankingViewProps> = ({
  cityState,
  otherMayors,
  onOpenLoansWithCity,
  onOpenMultiplayer,
}) => {
  const [rankingList, setRankingList] = useState<CityRankingEntry[]>([]);
  const [sortBy, setSortBy] = useState<'treasury' | 'netMonthly' | 'population' | 'approvalRating'>('treasury');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<CityRankingEntry | null>(null);

  const fetchOnlineRanking = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/game/ranking');
      const data = await res.json();
      let serverList: CityRankingEntry[] = data.ranking || [];

      // Combine with local city state and room mayors if not present
      const myEntry: CityRankingEntry = {
        cityName: cityState.cityName,
        mayorName: cityState.mayorName,
        party: cityState.party,
        treasury: cityState.treasury,
        monthlyRevenue: cityState.monthlyRevenue,
        monthlyExpenses: cityState.monthlyExpenses,
        netMonthly: cityState.netMonthly,
        population: cityState.population,
        jobs: cityState.jobs,
        unemploymentRate: cityState.unemploymentRate,
        fiscalRating: cityState.fiscalRating,
        approvalRating: cityState.approvalRating,
        securityIndex: cityState.securityIndex,
        healthIndex: cityState.healthIndex,
        educationIndex: cityState.educationIndex,
        infrastructureIndex: cityState.infrastructureIndex,
        savedAt: Date.now(),
      };

      const map = new Map<string, CityRankingEntry>();
      map.set(myEntry.cityName.toLowerCase(), myEntry);

      serverList.forEach((entry) => {
        map.set(entry.cityName.toLowerCase(), entry);
      });

      // Also merge active room mayors
      (Object.values(otherMayors) as RegionalMayorProfile[]).forEach((m) => {
        const key = m.cityName.toLowerCase();
        if (!map.has(key)) {
          map.set(key, {
            cityName: m.cityName,
            mayorName: m.name,
            party: 'PARTIDO REGIONAL',
            treasury: m.treasury,
            monthlyRevenue: Math.round(m.treasury * 0.15),
            monthlyExpenses: Math.round(m.treasury * 0.12),
            netMonthly: Math.round(m.treasury * 0.03),
            population: m.population,
            jobs: m.jobs,
            unemploymentRate: m.unemploymentRate,
            fiscalRating: m.fiscalRating,
            approvalRating: m.approvalRating,
            securityIndex: 65,
            healthIndex: 68,
            educationIndex: 70,
            infrastructureIndex: 60,
            savedAt: m.lastUpdated,
          });
        }
      });

      const combined = Array.from(map.values());
      setRankingList(combined);
      if (!selectedCity && combined.length > 0) {
        setSelectedCity(combined[0]);
      }
    } catch (e) {
      console.error('Failed to load ranking:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOnlineRanking();
  }, [cityState.treasury, cityState.netMonthly, cityState.approvalRating]);

  // Sort list
  const sorted = [...rankingList].sort((a, b) => {
    if (sortBy === 'treasury') return b.treasury - a.treasury;
    if (sortBy === 'netMonthly') return b.netMonthly - a.netMonthly;
    if (sortBy === 'population') return b.population - a.population;
    if (sortBy === 'approvalRating') return b.approvalRating - a.approvalRating;
    return 0;
  });

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Top Banner & Online Sync Badge */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              Painel Econômico & Ranking Municipal
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Salvamento Online Automático Ativo
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Situação Econômica das Cidades
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
            Compare o poder fiscal, arrecadação, empregos e rating CAPAG de cada prefeitura no Brasil.
            Tome decisões financeiras e conceda empréstimos entre municípios para alavancar a região.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              sounds.playClick();
              fetchOnlineRanking();
            }}
            disabled={isLoading}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar Ranking
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenMultiplayer();
            }}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-colors"
          >
            <Building2 className="w-3.5 h-3.5" />
            Cúpula Metropolitana
          </button>
        </div>
      </div>

      {/* Filter and Sorting bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSortBy('treasury')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              sortBy === 'treasury'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Maior Tesouro (Caixa)
          </button>
          <button
            onClick={() => setSortBy('netMonthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              sortBy === 'netMonthly'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Maior Superávit Mensal
          </button>
          <button
            onClick={() => setSortBy('population')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              sortBy === 'population'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            População & Empregos
          </button>
          <button
            onClick={() => setSortBy('approvalRating')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              sortBy === 'approvalRating'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Aprovação do Prefeito
          </button>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Total de {sorted.length} municípios monitorados
        </span>
      </div>

      {/* Main Content: Table + Side Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard Table (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3.5 text-center w-12">#</th>
                  <th className="p-3.5">Cidade & Prefeito</th>
                  <th className="p-3.5 text-right">Tesouro Municipal</th>
                  <th className="p-3.5 text-right">Resultado Mês</th>
                  <th className="p-3.5 text-center">CAPAG</th>
                  <th className="p-3.5 text-center">Aprovação</th>
                  <th className="p-3.5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sorted.map((item, idx) => {
                  const isMe = item.cityName.toLowerCase() === cityState.cityName.toLowerCase();
                  const isSelected = selectedCity?.cityName === item.cityName;

                  return (
                    <tr
                      key={item.cityName + idx}
                      onClick={() => setSelectedCity(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-amber-500/10 border-l-4 border-l-amber-500'
                          : isMe
                          ? 'bg-emerald-950/30 hover:bg-emerald-950/50'
                          : 'hover:bg-slate-800/50'
                      }`}
                    >
                      <td className="p-3.5 text-center font-bold font-mono">
                        {idx === 0 && <span className="text-amber-400 text-base">🥇</span>}
                        {idx === 1 && <span className="text-slate-300 text-base">🥈</span>}
                        {idx === 2 && <span className="text-amber-600 text-base">🥉</span>}
                        {idx > 2 && <span className="text-slate-500">{idx + 1}º</span>}
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className="font-black text-white text-sm">
                            {item.cityName}
                          </div>
                          {isMe && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500 text-slate-950">
                              SUA CIDADE
                            </span>
                          )}
                        </div>
                        <div className="text-slate-400 text-[11px] mt-0.5">
                          Prefeito: <span className="text-slate-300 font-semibold">{item.mayorName}</span> ({item.party})
                        </div>
                      </td>

                      <td className="p-3.5 text-right font-mono font-bold text-emerald-400 text-sm">
                        R$ {item.treasury.toLocaleString()}
                      </td>

                      <td className="p-3.5 text-right font-mono font-bold">
                        <span
                          className={`flex items-center justify-end gap-1 ${
                            item.netMonthly >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {item.netMonthly >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {item.netMonthly >= 0 ? '+' : ''}R$ {Math.abs(item.netMonthly).toLocaleString()}
                        </span>
                      </td>

                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-black font-mono ${
                            item.fiscalRating === 'A'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                              : item.fiscalRating === 'B'
                              ? 'bg-blue-950 text-blue-400 border border-blue-700'
                              : item.fiscalRating === 'C'
                              ? 'bg-amber-950 text-amber-400 border border-amber-700'
                              : 'bg-rose-950 text-rose-400 border border-rose-700'
                          }`}
                        >
                          {item.fiscalRating}
                        </span>
                      </td>

                      <td className="p-3.5 text-center">
                        <span className="font-bold text-amber-300 font-mono">
                          {item.approvalRating}%
                        </span>
                      </td>

                      <td className="p-3.5 text-center">
                        {!isMe ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              sounds.playStamp();
                              onOpenLoansWithCity(item.cityName, item.mayorName);
                            }}
                            className="px-2.5 py-1 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg text-[11px] font-bold transition-all shadow"
                            title="Oferecer Empréstimo ou Apoio Financeiro"
                          >
                            Empréstimo
                          </button>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Sede</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* City Detail Card (1 Col) */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          {selectedCity ? (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                  Ficha Econômica & Indicadores
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {selectedCity.cityName}
                </h3>
                <p className="text-xs text-slate-400">
                  Prefeito: <strong className="text-white">{selectedCity.mayorName}</strong> ({selectedCity.party})
                </p>
              </div>

              {/* Grid metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">TESOURO</div>
                  <div className="text-sm font-mono font-black text-emerald-400 mt-0.5">
                    R$ {selectedCity.treasury.toLocaleString()}
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">POPULAÇÃO</div>
                  <div className="text-sm font-mono font-black text-slate-200 mt-0.5">
                    {selectedCity.population.toLocaleString()} hab.
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">RECEITA MENSAL</div>
                  <div className="text-sm font-mono font-black text-sky-400 mt-0.5">
                    R$ {selectedCity.monthlyRevenue.toLocaleString()}
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">DESPESA MENSAL</div>
                  <div className="text-sm font-mono font-black text-rose-400 mt-0.5">
                    R$ {selectedCity.monthlyExpenses.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Setorial Indicators */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Índices Setoriais de Gestão
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Saúde & SUS:</span>
                    <span className="font-bold text-rose-400 font-mono">{selectedCity.healthIndex}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${selectedCity.healthIndex}%` }} />
                  </div>

                  <div className="flex justify-between text-slate-300 pt-1">
                    <span>Educação & Merenda:</span>
                    <span className="font-bold text-sky-400 font-mono">{selectedCity.educationIndex}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${selectedCity.educationIndex}%` }} />
                  </div>

                  <div className="flex justify-between text-slate-300 pt-1">
                    <span>Segurança & Guarda:</span>
                    <span className="font-bold text-indigo-400 font-mono">{selectedCity.securityIndex}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${selectedCity.securityIndex}%` }} />
                  </div>

                  <div className="flex justify-between text-slate-300 pt-1">
                    <span>Infraestrutura Urbana:</span>
                    <span className="font-bold text-amber-400 font-mono">{selectedCity.infrastructureIndex}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${selectedCity.infrastructureIndex}%` }} />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {selectedCity.cityName.toLowerCase() !== cityState.cityName.toLowerCase() && (
                <div className="pt-4 border-t border-slate-800">
                  <button
                    onClick={() => {
                      sounds.playStamp();
                      onOpenLoansWithCity(selectedCity.cityName, selectedCity.mayorName);
                    }}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Landmark className="w-4 h-4" />
                    Abrir Negociação de Empréstimo
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Selecione um município na tabela para visualizar o demonstrativo econômico completo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
