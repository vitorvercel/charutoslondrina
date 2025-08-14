"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Square, Clock, Flame, Play, Plus } from "lucide-react"
import { FinishTastingDialog } from "@/components/finish-tasting-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TastingDialog } from "@/components/tasting-dialog"
import { supabase, degustacaoService, estoqueService, CharutoDegustacao } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function DegustacaoPage() {
  const [charutosDegustacao, setCharutosDegustacao] = useState<CharutoDegustacao[]>([])
  const [selectedCharuto, setSelectedCharuto] = useState<CharutoDegustacao | null>(null)
  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false)
  const [notas, setNotas] = useState("")
  const [avaliacao, setAvaliacao] = useState<number>(5)
  const [loading, setLoading] = useState(true)

  const [isStartTastingDialogOpen, setIsStartTastingDialogOpen] = useState(false)
  const [charutosDisponiveis, setCharutosDisponiveis] = useState<any[]>([])
  const [selectedCharutoForTasting, setSelectedCharutoForTasting] = useState<any>(null)
  const [isTastingDialogOpen, setIsTastingDialogOpen] = useState(false)

  const { toast } = useToast()

  // Função para carregar degustações do Supabase
  const carregarDegustacoes = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado",
          variant: "destructive"
        })
        return
      }

      const degustacoes = await degustacaoService.getDegustacoes(user.id)
      setCharutosDegustacao(degustacoes)
    } catch (error) {
      console.error('Erro ao carregar degustações:', error)
      toast({
        title: "Erro",
        description: "Falha ao carregar degustações",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Função para carregar charutos disponíveis do estoque (Supabase)
  const carregarCharutosDisponiveis = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const estoque = await estoqueService.getCharutos(user.id)
      const disponiveis = (estoque || []).filter((c) => (c.quantidade || 0) > 0).map((c) => ({
        id: c.id,
        nome: c.nome,
        marca: c.marca,
        paisOrigem: c.pais_origem || "",
        preco: c.preco || 0,
        quantidade: c.quantidade || 0,
        dataCompra: c.data_compra ? c.data_compra.substring(0, 10) : "",
        foto: c.foto || "",
      }))
      setCharutosDisponiveis(disponiveis)
    } catch (error) {
      console.error('Erro ao carregar charutos disponíveis:', error)
    }
  }

  useEffect(() => {
    carregarDegustacoes()
    carregarCharutosDisponiveis()
  }, [])

  const finalizarDegustacao = (charuto: CharutoDegustacao) => {
    setSelectedCharuto(charuto)
    setNotas(charuto.notas || "")
    setAvaliacao(charuto.avaliacao || 5)
    setIsFinishDialogOpen(true)
  }

  const handleFinalizarDegustacao = async (finishData: any) => {
    if (!selectedCharuto) return

    try {
      // Mapear campos para snake_case conforme schema do banco
      const payload = {
        sabores: finishData.sabores,
        avaliacao: finishData.avaliacao,
        duracao_fumo: finishData.duracaoFumo,
        compraria_novamente: finishData.comprariaNovamente,
        observacoes: finishData.observacoes,
        foto_anilha: finishData.fotoAnilha,
        notas: finishData.notas,
      }

      // Finalizar no Supabase
      const charutoFinalizado = await degustacaoService.finalizarDegustacao(selectedCharuto.id, payload)

      // Atualizar estado local
      setCharutosDegustacao((prev) =>
        prev.map((c) => (c.id === selectedCharuto.id ? charutoFinalizado : c))
      )

      toast({
        title: "Sucesso",
        description: "Degustação finalizada com sucesso!",
      })

      setSelectedCharuto(null)
    } catch (error) {
      console.error('Erro ao finalizar degustação:', error)
      toast({
        title: "Erro",
        description: "Falha ao finalizar degustação",
        variant: "destructive"
      })
    }
  }

  const removerDaDegustacao = async (id: string) => {
    if (confirm("Tem certeza que deseja remover este charuto da degustação?")) {
      try {
        await degustacaoService.deleteDegustacao(id)
        setCharutosDegustacao((prev) => prev.filter((c) => c.id !== id))

        toast({
          title: "Sucesso",
          description: "Charuto removido da degustação",
        })
      } catch (error) {
        console.error('Erro ao remover degustação:', error)
        toast({
          title: "Erro",
          description: "Falha ao remover degustação",
          variant: "destructive"
        })
      }
    }
  }

  const charutosEmDegustacao = charutosDegustacao.filter((c) => c.status === "em-degustacao")
  const charutosFinalizados = charutosDegustacao.filter((c) => c.status === "finalizado")

  const formatarTempo = (dataInicio: string) => {
    const inicio = new Date(dataInicio)
    const agora = new Date()
    const diffMinutos = Math.floor((agora.getTime() - inicio.getTime()) / (1000 * 60))

    if (diffMinutos < 60) {
      return `${diffMinutos} min`
    } else {
      const horas = Math.floor(diffMinutos / 60)
      const minutos = diffMinutos % 60
      return `${horas}h ${minutos}min`
    }
  }

  const handleStartTastingFromDegustacao = (charuto: any) => {
    setSelectedCharutoForTasting(charuto)
    setIsStartTastingDialogOpen(false)
    setIsTastingDialogOpen(true)
  }

  const handleStartTasting = async (tastingData: any) => {
    if (!selectedCharutoForTasting) return

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado",
          variant: "destructive"
        })
        return
      }

      // Reduzir quantidade no estoque (Supabase)
      const atualizado = await estoqueService.decrementQuantidade(selectedCharutoForTasting.id, 1)

      // Criar nova degustação no Supabase
      const novaDegustacao = await degustacaoService.createDegustacao({
        charuto_id: selectedCharutoForTasting.id,
        nome: selectedCharutoForTasting.nome,
        marca: selectedCharutoForTasting.marca,
        pais_origem: selectedCharutoForTasting.paisOrigem || selectedCharutoForTasting.origem || "",
        data_inicio: new Date().toISOString(),
        status: "em-degustacao",
        user_id: user.id,
        corte: tastingData.corte,
        momento: tastingData.momento,
        fluxo: tastingData.fluxo,
        vitola: tastingData.vitola
      })

      // Atualizar estado local
      setCharutosDegustacao((prev) => [...prev, novaDegustacao])

      // Atualizar charutos disponíveis
      setCharutosDisponiveis((prev) => prev.map((c: any) => c.id === atualizado.id ? { ...c, quantidade: atualizado.quantidade } : c).filter((c: any) => c.quantidade > 0))

      toast({
        title: "Sucesso",
        description: "Degustação iniciada com sucesso!",
      })

      setSelectedCharutoForTasting(null)
    } catch (error) {
      console.error('Erro ao iniciar degustação:', error)
      toast({
        title: "Erro",
        description: "Falha ao iniciar degustação",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando degustações...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Degustação</h1>
          <p className="text-gray-600">Acompanhe suas experiências em tempo real</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Em Degustação</p>
                  <p className="text-3xl font-bold text-gray-900">{charutosEmDegustacao.length}</p>
                  <p className="text-xs text-gray-500">Ativos agora</p>
                </div>
                <Play className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Finalizadas</p>
                  <p className="text-3xl font-bold text-gray-900">{charutosFinalizados.length}</p>
                  <p className="text-xs text-gray-500">Hoje</p>
                </div>
                <Square className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {charutosFinalizados.length > 0
                      ? Math.round(
                        charutosFinalizados.reduce((acc, c) => acc + (c.duracao_fumo || 0), 0) /
                        charutosFinalizados.length,
                      )
                      : 0}
                  </p>
                  <p className="text-xs text-gray-500">Minutos</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {charutosFinalizados.length > 0
                      ? (
                        charutosFinalizados.reduce((acc, c) => acc + (c.avaliacao || 0), 0) /
                        charutosFinalizados.length
                      ).toFixed(1)
                      : "0.0"}
                  </p>
                  <p className="text-xs text-gray-500">De 10</p>
                </div>
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Em Degustação */}
        <Card className="bg-white border-0 shadow-sm mb-8">
          <CardHeader className="border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <Flame className="w-6 h-6 mr-2 text-orange-500" />
                  Em Degustação ({charutosEmDegustacao.length})
                </CardTitle>
                <CardDescription className="text-gray-600">Charutos que você está fumando agora</CardDescription>
              </div>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={() => setIsStartTastingDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Iniciar Nova Degustação
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {charutosEmDegustacao.length === 0 ? (
              <div className="text-center py-12">
                <Flame className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Nenhum charuto em degustação</p>
                <p className="text-sm text-gray-500">Vá para o estoque e inicie uma degustação!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {charutosEmDegustacao.map((charuto) => (
                  <Card key={charuto.id} className="border-2 border-orange-200 bg-orange-50">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900">{charuto.nome}</CardTitle>
                          <CardDescription className="text-gray-600">{charuto.marca}</CardDescription>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatarTempo(charuto.data_inicio)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 mb-4">
                        {charuto.pais_origem && (
                          <p className="text-sm text-gray-600">
                            <strong>Origem:</strong> {charuto.pais_origem}
                          </p>
                        )}
                        {charuto.vitola && (
                          <p className="text-sm text-gray-600">
                            <strong>Vitola:</strong> {charuto.vitola}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          <strong>Iniciado:</strong> {new Date(charuto.data_inicio).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                          onClick={() => finalizarDegustacao(charuto)}
                        >
                          <Square className="w-4 h-4 mr-2" />
                          Finalizar
                        </Button>
                        <Button variant="outline" onClick={() => removerDaDegustacao(charuto.id)}>
                          Remover
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Finalizados Recentemente */}
        {charutosFinalizados.length > 0 && (
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl font-semibold text-gray-900">Finalizados Recentemente</CardTitle>
              <CardDescription className="text-gray-600">Suas últimas degustações</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {charutosFinalizados.slice(0, 6).map((charuto) => (
                  <Card key={charuto.id} className="border-2 border-green-200 bg-green-50">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900">{charuto.nome}</CardTitle>
                          <CardDescription className="text-gray-600">{charuto.marca}</CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          ⭐ {charuto.avaliacao}/10
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <strong>Tempo fumado:</strong> {charuto.duracao_fumo} min
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Finalizado:</strong>{" "}
                          {charuto.data_fim ? new Date(charuto.data_fim).toLocaleString("pt-BR") : "N/A"}
                        </p>
                        {charuto.observacoes && (
                          <p className="text-sm text-gray-600">
                            <strong>Notas:</strong> {charuto.observacoes.substring(0, 100)}
                            {charuto.observacoes.length > 100 ? "..." : ""}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialog para finalizar degustação */}
        <FinishTastingDialog
          charuto={selectedCharuto}
          isOpen={isFinishDialogOpen}
          onClose={() => setIsFinishDialogOpen(false)}
          onFinish={handleFinalizarDegustacao}
        />

        {/* Dialog para selecionar charuto para degustação */}
        <Dialog open={isStartTastingDialogOpen} onOpenChange={setIsStartTastingDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Selecionar Charuto para Degustação</DialogTitle>
              <DialogDescription>Escolha um charuto disponível no seu estoque</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {charutosDisponiveis.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Nenhum charuto disponível no estoque</p>
              ) : (
                charutosDisponiveis.map((charuto) => (
                  <div
                    key={charuto.id}
                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleStartTastingFromDegustacao(charuto)}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{charuto.nome}</p>
                      <p className="text-sm text-gray-600">{charuto.marca}</p>
                    </div>
                    <Badge variant="secondary">{charuto.quantidade}</Badge>
                  </div>
                ))
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsStartTastingDialogOpen(false)}>
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de degustação */}
        <TastingDialog
          charuto={selectedCharutoForTasting}
          isOpen={isTastingDialogOpen}
          onClose={() => setIsTastingDialogOpen(false)}
          onStartTasting={handleStartTasting}
        />
      </div>
    </div>
  )
}
