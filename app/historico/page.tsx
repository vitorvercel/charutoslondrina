"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Clock, Star, Flame, Search, Eye } from "lucide-react"

interface HistoricoItem {
  id: string
  nome: string
  marca: string
  paisOrigem: string
  avaliacao: number
  duracaoFumo: number
  dataFim: string
  sabores: string[]
  observacoes: string
  comprariaNovamente: string
  corte?: string
  momento?: string
  fluxo?: string
  fotoAnilha?: string
}

export default function HistoricoPage() {
  const [historico, setHistorico] = useState<HistoricoItem[]>([])
  const [filtroTexto, setFiltroTexto] = useState("")
  const [filtroAvaliacao, setFiltroAvaliacao] = useState("todas")
  const [selectedCharuto, setSelectedCharuto] = useState<HistoricoItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const savedHistory = localStorage.getItem("charutos-historico")
    if (savedHistory) {
      setHistorico(JSON.parse(savedHistory))
    }
  }, [])

  const historicoFiltrado = historico.filter((item) => {
    const matchTexto =
      item.nome.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      item.marca.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      item.paisOrigem.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      item.observacoes.toLowerCase().includes(filtroTexto.toLowerCase())

    const matchAvaliacao =
      filtroAvaliacao === "todas" ||
      (filtroAvaliacao === "9-10" && item.avaliacao >= 9) ||
      (filtroAvaliacao === "7-8" && item.avaliacao >= 7 && item.avaliacao < 9) ||
      (filtroAvaliacao === "5-6" && item.avaliacao >= 5 && item.avaliacao < 7) ||
      (filtroAvaliacao === "3-4" && item.avaliacao >= 3 && item.avaliacao < 5) ||
      (filtroAvaliacao === "1-2" && item.avaliacao >= 1 && item.avaliacao < 3)

    return matchTexto && matchAvaliacao
  })

  const totalDegustacoes = historico.length
  const tempoMedio =
    historico.length > 0 ? Math.round(historico.reduce((acc, h) => acc + h.duracaoFumo, 0) / historico.length) : 0
  const avaliacaoMedia =
    historico.length > 0 ? (historico.reduce((acc, h) => acc + h.avaliacao, 0) / historico.length).toFixed(1) : "0.0"
  const melhorAvaliacao = historico.length > 0 ? Math.max(...historico.map((h) => h.avaliacao)) : 0

  const openModal = (charuto: HistoricoItem) => {
    setSelectedCharuto(charuto)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Histórico</h1>
          <p className="text-gray-600">Revise suas avaliações anteriores</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Degustações</p>
                  <p className="text-3xl font-bold text-gray-900">{totalDegustacoes}</p>
                  <p className="text-xs text-gray-500">Registradas</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                  <p className="text-3xl font-bold text-gray-900">{tempoMedio}</p>
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
                  <p className="text-3xl font-bold text-gray-900">{avaliacaoMedia}</p>
                  <p className="text-xs text-gray-500">De 10</p>
                </div>
                <Star className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Melhor Avaliação</p>
                  <p className="text-3xl font-bold text-gray-900">{melhorAvaliacao}</p>
                  <p className="text-xs text-gray-500">Pontos</p>
                </div>
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Filtros</CardTitle>
            <CardDescription className="text-gray-600">Encontre degustações específicas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Buscar por nome, marca, origem ou notas..."
                    value={filtroTexto}
                    onChange={(e) => setFiltroTexto(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Avaliação</label>
                <Select value={filtroAvaliacao} onValueChange={setFiltroAvaliacao}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="9-10">9-10 (Excelente)</SelectItem>
                    <SelectItem value="7-8">7-8 (Muito Bom)</SelectItem>
                    <SelectItem value="5-6">5-6 (Bom)</SelectItem>
                    <SelectItem value="3-4">3-4 (Regular)</SelectItem>
                    <SelectItem value="1-2">1-2 (Ruim)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History List */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Suas Degustações ({historicoFiltrado.length})
            </CardTitle>
            <CardDescription className="text-gray-600">Histórico completo de experiências</CardDescription>
          </CardHeader>
          <CardContent>
            {historicoFiltrado.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {historico.length === 0 ? "Nenhuma degustação no histórico ainda" : "Nenhuma degustação encontrada"}
                </h4>
                <p className="text-gray-500">
                  {historico.length === 0
                    ? "Suas degustações finalizadas aparecerão aqui"
                    : "Tente ajustar os filtros de busca"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {historicoFiltrado.map((item) => (
                  <Card key={item.id} className="border-2 border-gray-200 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900">{item.nome}</CardTitle>
                          <CardDescription className="text-gray-600">{item.marca}</CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">⭐ {item.avaliacao}/10</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600">
                          <strong>Data:</strong> {new Date(item.dataFim).toLocaleDateString("pt-BR")}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Tempo:</strong> {item.duracaoFumo} min
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Compraria novamente:</strong>{" "}
                          {item.comprariaNovamente === "sim"
                            ? "Sim"
                            : item.comprariaNovamente === "nao"
                              ? "Não"
                              : "Depende"}
                        </p>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent" onClick={() => openModal(item)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de Detalhes */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{selectedCharuto?.nome}</DialogTitle>
              <DialogDescription className="text-gray-600">
                {selectedCharuto?.marca} - {selectedCharuto?.paisOrigem}
              </DialogDescription>
            </DialogHeader>

            {selectedCharuto && (
              <div className="space-y-6">
                {/* Informações Básicas */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Avaliação</p>
                    <div className="flex items-center">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        ⭐ {selectedCharuto.avaliacao}/10
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Duração</p>
                    <p className="text-lg font-semibold">{selectedCharuto.duracaoFumo} minutos</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Data da Degustação</p>
                    <p className="text-lg font-semibold">
                      {new Date(selectedCharuto.dataFim).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Compraria Novamente</p>
                    <p className="text-lg font-semibold">
                      {selectedCharuto.comprariaNovamente === "sim"
                        ? "Sim"
                        : selectedCharuto.comprariaNovamente === "nao"
                          ? "Não"
                          : "Depende do Preço"}
                    </p>
                  </div>
                </div>

                {/* Detalhes da Degustação */}
                {(selectedCharuto.corte || selectedCharuto.momento || selectedCharuto.fluxo) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Detalhes da Degustação</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedCharuto.corte && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Tipo de Corte</p>
                          <p className="text-base capitalize">{selectedCharuto.corte}</p>
                        </div>
                      )}
                      {selectedCharuto.momento && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Momento</p>
                          <p className="text-base capitalize">{selectedCharuto.momento}</p>
                        </div>
                      )}
                      {selectedCharuto.fluxo && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Fluxo</p>
                          <p className="text-base capitalize">{selectedCharuto.fluxo}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Sabores */}
                {selectedCharuto.sabores && selectedCharuto.sabores.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Sabores Identificados</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCharuto.sabores.map((sabor, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {sabor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Observações */}
                {selectedCharuto.observacoes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Observações</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{selectedCharuto.observacoes}</p>
                    </div>
                  </div>
                )}

                {/* Foto da Anilha */}
                {selectedCharuto.fotoAnilha && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Foto da Anilha</h3>
                    <img
                      src={selectedCharuto.fotoAnilha || "/placeholder.svg"}
                      alt="Anilha do charuto"
                      className="max-w-full h-auto rounded-lg border"
                    />
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
