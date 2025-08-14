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

interface CharutoDegustacao {
  id: string
  charuteId: string
  nome: string
  marca: string
  paisOrigem: string
  dataInicio: string
  dataFim?: string
  status: "em-degustacao" | "finalizado"

  // Dados da etapa 2 (início da degustação)
  corte?: string
  momento?: string
  fluxo?: string

  // Dados da etapa 3 (finalização)
  sabores?: string[]
  avaliacao?: number
  duracaoFumo?: number
  comprariaNovamente?: string
  observacoes?: string
  fotoAnilha?: string
}

export default function DegustacaoPage() {
  const [charutosDegustacao, setCharutosDegustacao] = useState<CharutoDegustacao[]>([])
  const [selectedCharuto, setSelectedCharuto] = useState<CharutoDegustacao | null>(null)
  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false)
  const [notas, setNotas] = useState("")
  const [avaliacao, setAvaliacao] = useState<number>(5)

  const [isStartTastingDialogOpen, setIsStartTastingDialogOpen] = useState(false)
  const [charutosDisponiveis, setCharutosDisponiveis] = useState<any[]>([])
  const [selectedCharutoForTasting, setSelectedCharutoForTasting] = useState<any>(null)
  const [isTastingDialogOpen, setIsTastingDialogOpen] = useState(false)

  useEffect(() => {
    const savedTasting = localStorage.getItem("charutos-degustacao")
    if (savedTasting) {
      setCharutosDegustacao(JSON.parse(savedTasting))
    }

    // Carregar charutos disponíveis
    const estoque = JSON.parse(localStorage.getItem("charutos-estoque") || "[]")
    setCharutosDisponiveis(estoque.filter((c: any) => c.quantidade > 0))
  }, [])

  useEffect(() => {
    localStorage.setItem("charutos-degustacao", JSON.stringify(charutosDegustacao))
  }, [charutosDegustacao])

  const finalizarDegustacao = (charuto: CharutoDegustacao) => {
    setSelectedCharuto(charuto)
    setNotas(charuto.notas || "")
    setAvaliacao(charuto.avaliacao || 5)
    setIsFinishDialogOpen(true)
  }

  const handleFinalizarDegustacao = (finishData: any) => {
    if (!selectedCharuto) return

    const charutoFinalizado: CharutoDegustacao = {
      ...selectedCharuto,
      status: "finalizado",
      ...finishData,
    }

    setCharutosDegustacao((prev) => prev.map((c) => (c.id === selectedCharuto.id ? charutoFinalizado : c)))

    const savedHistory = localStorage.getItem("charutos-historico")
    const historyList = savedHistory ? JSON.parse(savedHistory) : []
    localStorage.setItem("charutos-historico", JSON.stringify([...historyList, charutoFinalizado]))

    setSelectedCharuto(null)
  }

  const removerDaDegustacao = (id: string) => {
    if (confirm("Tem certeza que deseja remover este charuto da degustação?")) {
      setCharutosDegustacao((prev) => prev.filter((c) => c.id !== id))
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

  const handleStartTasting = (tastingData: any) => {
    if (!selectedCharutoForTasting) return

    // Reduzir quantidade no estoque
    const estoque = JSON.parse(localStorage.getItem("charutos-estoque") || "[]")
    const estoqueAtualizado = estoque.map((c: any) =>
      c.id === selectedCharutoForTasting.id ? { ...c, quantidade: c.quantidade - 1 } : c,
    )
    localStorage.setItem("charutos-estoque", JSON.stringify(estoqueAtualizado))

    // Adicionar à degustação
    const charutoDegustacao = {
      id: Date.now().toString(),
      ...tastingData,
    }

    const savedTasting = localStorage.getItem("charutos-degustacao")
    const tastingList = savedTasting ? JSON.parse(savedTasting) : []
    const updatedTasting = [...tastingList, charutoDegustacao]
    localStorage.setItem("charutos-degustacao", JSON.stringify(updatedTasting))
    setCharutosDegustacao(updatedTasting)

    alert("Degustação iniciada!")
    setSelectedCharutoForTasting(null)
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
                          charutosFinalizados.reduce((acc, c) => acc + (c.duracaoFumo || 0), 0) /
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
                          {formatarTempo(charuto.dataInicio)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 mb-4">
                        {charuto.paisOrigem && (
                          <p className="text-sm text-gray-600">
                            <strong>Origem:</strong> {charuto.paisOrigem}
                          </p>
                        )}
                        {charuto.vitola && (
                          <p className="text-sm text-gray-600">
                            <strong>Vitola:</strong> {charuto.vitola}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          <strong>Iniciado:</strong> {new Date(charuto.dataInicio).toLocaleString("pt-BR")}
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
                          <strong>Tempo fumado:</strong> {charuto.duracaoFumo} min
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Finalizado:</strong>{" "}
                          {charuto.dataFim ? new Date(charuto.dataFim).toLocaleString("pt-BR") : "N/A"}
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
