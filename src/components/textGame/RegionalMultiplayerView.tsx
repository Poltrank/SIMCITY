import React, { useState } from 'react';
import {
  Radio,
  Users,
  Briefcase,
  Palmtree,
  Zap,
  Flame,
  Pickaxe,
  DollarSign,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Handshake,
  MessageSquare,
  Shield,
  Building,
  TrendingUp,
  Share2,
} from 'lucide-react';
import {
  PrefeitoCityState,
  RegionalMayorProfile,
  RegionalTreaty,
  RegionalChatMessage,
} from '../../types/textGame';
import { sounds } from '../../audio/soundManager';

interface RegionalMultiplayerViewProps {
  cityState: PrefeitoCityState;
  roomId: string;
  isConnected: boolean;
  myRole: 'mayor_north' | 'mayor_south' | 'spectator';
  otherMayors: Record<string, RegionalMayorProfile>;
  treaties: RegionalTreaty[];
  chatMessages: RegionalChatMessage[];
  onConnectRoom: (code: string) => void;
  onProposeTreaty: (draft: {
    type: RegionalTreaty['type'];
    title: string;
    details: string;
    amount: number;
    monthlyCostOrPrice: number;
  }) => void;
  onRespondTreaty: (treatyId: string, accept: boolean) => void;
  onSendMessage: (text: string) => void;
}

export const RegionalMultiplayerView: React.FC<RegionalMultiplayerViewProps> = ({
  cityState,
  roomId,
  isConnected,
  myRole,
  otherMayors,
  treaties,
  chatMessages,
  onConnectRoom,
  onProposeTreaty,
  onRespondTreaty,
  onSendMessage,
}) => {
  const [inputRoom, setInputRoom] = useState(roomId);
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState<'cenario' | 'tratados' | 'chat'>('cenario');

  // Filter out self to find neighboring mayor
  const allMayors = Object.values(otherMayors) as RegionalMayorProfile[];
  const neighbors = allMayors.filter((m) => m.name !== cityState.mayorName);
  const neighbor: RegionalMayorProfile | null = neighbors[0] || null;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(chatInput);
    setChatInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Conexão de Sala */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            Consórcio Intermunicipal de Desenvolvimento Regional
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Multijogador: Integração Entre Prefeitos Vizinhos
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Conecte dois dispositivos na mesma Região para negociar tratados de turistas,
            intercâmbio de empregos e venda de energia e petróleo!
          </p>
        </div>

        {/* Input de Código de Região */}
        <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <input
            type="text"
            value={inputRoom}
            onChange={(e) => setInputRoom(e.target.value.toUpperCase())}
            placeholder="CÓDIGO (EX: BRASIL1)"
            className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold text-white uppercase tracking-wider focus:outline-none focus:border-sky-500 w-36"
          />
          <button
            onClick={() => {
              sounds.playClick();
              onConnectRoom(inputRoom);
            }}
            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg transition-colors whitespace-nowrap"
          >
            {isConnected ? 'Conectado' : 'Conectar'}
          </button>
        </div>
      </div>

      {/* Sub-navegação do Multiplayer */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('cenario');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors ${
            activeTab === 'cenario'
              ? 'bg-sky-500 text-slate-950'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Building className="w-4 h-4" />
          Cidades & Comparativo Regional
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('tratados');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors ${
            activeTab === 'tratados'
              ? 'bg-sky-500 text-slate-950'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Handshake className="w-4 h-4" />
          Tratados & Negociações ({treaties.length})
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('chat');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors ${
            activeTab === 'chat'
              ? 'bg-sky-500 text-slate-950'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Linha Direta Diplomática ({chatMessages.length})
        </button>
      </div>

      {/* ABA 1: COMPARATIVO DAS DUAS CIDADES */}
      {activeTab === 'cenario' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Cidade do Jogador Atual */}
            <div className="bg-slate-900 border-2 border-sky-500/40 rounded-xl p-5 shadow-md">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">
                    Sua Administração Municipal
                  </span>
                  <h3 className="text-lg font-black text-white">{cityState.cityName}</h3>
                  <span className="text-xs text-slate-400">
                    {cityState.mayorName} ({cityState.party})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2 py-0.5 rounded font-bold bg-sky-950 text-sky-300 border border-sky-600/40">
                    {myRole === 'mayor_north' ? 'Distrito Norte' : 'Distrito Sul'}
                  </span>
                </div>
              </div>

              {/* Estatísticas Chave */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">População</span>
                  <strong className="text-sm text-slate-100 font-bold">
                    {cityState.population.toLocaleString()} hab.
                  </strong>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Vagas de Emprego</span>
                  <strong className="text-sm text-amber-300 font-bold">
                    {cityState.jobs.toLocaleString()} vagas ({cityState.unemploymentRate}% desemprego)
                  </strong>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Turistas por Mês</span>
                  <strong className="text-sm text-emerald-300 font-bold">
                    {cityState.touristsPerMonth.toLocaleString()} visitantes
                  </strong>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Tesouro em Caixa</span>
                  <strong className="text-sm text-emerald-400 font-bold">
                    R$ {cityState.treasury.toLocaleString()}
                  </strong>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Energia Excedente</span>
                  <strong className="text-sm text-sky-400 font-bold">
                    +{cityState.energySurplusMw} MW disponíveis
                  </strong>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Petróleo & Ouro</span>
                  <strong className="text-sm text-amber-400 font-bold">
                    {cityState.oilProductionBpd} bpd | {cityState.goldProductionKg} kg ouro
                  </strong>
                </div>
              </div>
            </div>

            {/* Cidade Vizinha (Segundo Jogador) */}
            <div className="bg-slate-900 border-2 border-emerald-500/30 rounded-xl p-5 shadow-md">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                    Prefeitura Vizinha Conectada
                  </span>
                  <h3 className="text-lg font-black text-white">
                    {neighbor ? neighbor.cityName : 'Aguardando Segundo Prefeito...'}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {neighbor ? neighbor.name : `Abra outro navegador no código ${roomId}`}
                  </span>
                </div>
                {neighbor && (
                  <span className="text-xs px-2 py-0.5 rounded font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/40">
                    Conectado
                  </span>
                )}
              </div>

              {neighbor ? (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">População</span>
                    <strong className="text-sm text-slate-100 font-bold">
                      {neighbor.population.toLocaleString()} hab.
                    </strong>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Empregos & Vagas</span>
                    <strong className="text-sm text-amber-300 font-bold">
                      {neighbor.jobs.toLocaleString()} ({neighbor.unemploymentRate}% desemprego)
                    </strong>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Turistas por Mês</span>
                    <strong className="text-sm text-emerald-300 font-bold">
                      {neighbor.touristsPerMonth.toLocaleString()} visitantes
                    </strong>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Tesouro em Caixa</span>
                    <strong className="text-sm text-emerald-400 font-bold">
                      R$ {neighbor.treasury.toLocaleString()}
                    </strong>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Energia Excedente</span>
                    <strong className="text-sm text-sky-400 font-bold">
                      +{neighbor.energySurplusMw} MW disponíveis
                    </strong>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Petróleo & Ouro</span>
                    <strong className="text-sm text-amber-400 font-bold">
                      {neighbor.oilProductionBpd} bpd | {neighbor.goldProductionKg} kg ouro
                    </strong>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl">
                  <Users className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                  <h4 className="text-sm font-bold text-slate-300">Sala Pronta para Conexão</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Para jogar com um amigo em tempo real, compartilhe o código{' '}
                    <strong className="text-sky-300">{roomId}</strong>. Ambos poderão governar suas cidades e
                    negociar turistas, vagas de emprego e matriz de energia!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: TRATADOS & NEGOCIAÇÕES BILATERAIS */}
      {activeTab === 'tratados' && (
        <div className="space-y-6">
          {/* Propostas de Tratado Rápido */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Handshake className="w-4 h-4 text-amber-400" />
              Propor Tratado Bilateral com a Cidade Vizinha (Ratificação em 60s)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Tratado 1: Corredor de Turismo */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-slate-700 transition-all">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-1">
                    <Palmtree className="w-4 h-4" />
                    Turismo Integrado
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">
                    Corredor Turístico Metropolitano
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Abre linhas expressas de turismo conjunto entre as cidades. Aumenta os turistas em ambas
                    as cidades em <strong className="text-emerald-300">+30%</strong> e gera receita de hotéis e
                    restaurantes.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onProposeTreaty({
                      type: 'tourism_corridor',
                      title: 'Corredor Turístico Regional Compartilhado',
                      details: 'Acordo de incentivo a pacotes turísticos mútuos com linhas expressas de ônibus.',
                      amount: 30, // +30% tourists
                      monthlyCostOrPrice: 40000,
                    });
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
                >
                  Propor Tratado de Turismo
                </button>
              </div>

              {/* Tratado 2: Intercâmbio de Mão-de-Obra */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-slate-700 transition-all">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase mb-1">
                    <Briefcase className="w-4 h-4" />
                    Mercado de Trabalho
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">
                    Pacto Regional de Empregos & Trabalhadores
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Integra o sistema de transporte operário. A cidade industrial absorve trabalhadores da
                    cidade vizinha, reduzindo o desemprego para ambas.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onProposeTreaty({
                      type: 'worker_migration',
                      title: 'Pacto de Intercâmbio de Mão-de-Obra',
                      details: 'Transporte integrado de trabalhadores para os polos industriais metropolitanos.',
                      amount: 1500, // 1500 vagas
                      monthlyCostOrPrice: 25000,
                    });
                  }}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
                >
                  Propor Intercâmbio de Empregos
                </button>
              </div>

              {/* Tratado 3: Venda de Energia Elétrica MW */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-slate-700 transition-all">
                <div>
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase mb-1">
                    <Zap className="w-4 h-4" />
                    Rede Elétrica
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">
                    Contrato de Fornecimento de Energia (15 MW)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Exporta 15 Megawatts (MW) da sua geração excedente para a cidade vizinha a um valor
                    mensal de <strong className="text-sky-300">R$ 120.000/mês</strong>.
                  </p>
                </div>
                <button
                  disabled={cityState.energySurplusMw < 10}
                  onClick={() => {
                    onProposeTreaty({
                      type: 'power_contract',
                      title: 'Contrato de Fornecimento de Energia (15 MW)',
                      details: 'Venda direta de 15 MW excedentes de energia limpa para abastecer a cidade vizinha.',
                      amount: 15,
                      monthlyCostOrPrice: 120000,
                    });
                  }}
                  className={`w-full py-2 font-bold text-xs rounded-lg transition-colors shadow-sm ${
                    cityState.energySurplusMw >= 10
                      ? 'bg-sky-600 hover:bg-sky-500 text-white'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {cityState.energySurplusMw >= 10 ? 'Vender 15 MW de Energia' : 'Sem Energia Suficiente (<10 MW)'}
                </button>
              </div>
            </div>
          </div>

          {/* Tratados Ativos & Pendentes */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
              Tratados Registrados no Cartório Regional ({treaties.length})
            </h3>

            {treaties.length === 0 ? (
              <div className="p-6 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl">
                Nenhum tratado bilateral em vigor ou tramitando. Proponha um dos acordos acima!
              </div>
            ) : (
              <div className="space-y-3">
                {treaties.map((tr) => {
                  const isPending = tr.status === 'pending_ratification';
                  const isActive = tr.status === 'active';
                  const isTarget = tr.targetMayorRole === myRole;

                  return (
                    <div
                      key={tr.id}
                      className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-emerald-950/20 border-emerald-500/40'
                          : isPending
                          ? 'bg-amber-950/20 border-amber-500/40'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                              isActive
                                ? 'bg-emerald-400 text-slate-950'
                                : isPending
                                ? 'bg-amber-400 text-slate-950 animate-pulse'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {isActive ? 'Em Vigor' : isPending ? 'Aguardando Ratificação (60s)' : 'Arquivado'}
                          </span>
                          <span className="text-xs text-slate-400">Proposto por: {tr.fromMayorName}</span>
                        </div>
                        <h4 className="font-bold text-white text-base">{tr.title}</h4>
                        <p className="text-xs text-slate-300 mt-0.5">{tr.details}</p>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        {isPending && isTarget && (
                          <>
                            <button
                              onClick={() => onRespondTreaty(tr.id, true)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Ratificar Tratado
                            </button>
                            <button
                              onClick={() => onRespondTreaty(tr.id, false)}
                              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg flex items-center gap-1"
                            >
                              <XCircle className="w-4 h-4" />
                              Rejeitar
                            </button>
                          </>
                        )}
                        {isActive && (
                          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Acordo Ativo
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 3: LINHA DIRETA DIPLOMÁTICA / CHAT */}
      {activeTab === 'chat' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[500px] overflow-hidden">
          {/* Header do Chat */}
          <div className="bg-slate-950 p-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              <span className="font-bold text-xs text-slate-200">
                Canal Oficial Criptografado entre Gabinetes
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Região: {roomId}</span>
          </div>

          {/* Mensagens */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Nenhuma mensagem diplomática enviada ainda. Digite abaixo para falar com o prefeito vizinho!
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl max-w-lg text-xs leading-relaxed ${
                    msg.role === 'system'
                      ? 'bg-slate-950 border border-slate-800 text-amber-300 mx-auto text-center font-mono'
                      : msg.role === myRole
                      ? 'bg-sky-950/80 border border-sky-600/40 text-sky-100 ml-auto'
                      : 'bg-slate-800 border border-slate-700 text-slate-100 mr-auto'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 mb-1">
                    <strong className={msg.role === myRole ? 'text-sky-300' : 'text-emerald-300'}>
                      {msg.sender}
                    </strong>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-xs">{msg.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Form de Envio */}
          <form onSubmit={handleSendChat} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Escreva uma mensagem ou proposta para o prefeito vizinho..."
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
