"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Trash2, Edit, Plus, Package } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TastingDialog } from "@/components/tasting-dialog"

interface Charuto {
  id: string
  nome: string
  marca: string
  paisOrigem: string
  preco: number
  quantidade: number
  dataCompra: string
  foto?: string
}

export default function EstoquePage() {
  const [charutos, setCharutos] = useState<Charuto[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCharuto, setEditingCharuto] = useState<Charuto | null>(null)
  const [formData, setFormData] = useState<Partial<Charuto>>({
    nome: "",
    marca: "",
    paisOrigem: "",
    preco: 0,
    quantidade: 1,
    dataCompra: new Date().toISOString().split("T")[0],
    foto: "",
  })
  const [selectedCharutoForTasting, setSelectedCharutoForTasting] = useState<Charuto | null>(null)
  const [isTastingDialogOpen, setIsTastingDialogOpen] = useState(false)

  useEffect(() => {
    const savedCharutos = localStorage.getItem("charutos-estoque")
    if (savedCharutos) {
      setCharutos(JSON.parse(savedCharutos))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("charutos-estoque", JSON.stringify(charutos))
  }, [charutos])

  const handleInputChange = (field: keyof Charuto, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.marca) {
      alert("Nome e marca são obrigatórios!")
      return
    }

    if (editingCharuto) {
      setCharutos((prev) =>
        prev.map((charuto) => (charuto.id === editingCharuto.id ? ({ ...charuto, ...formData } as Charuto) : charuto)),
      )
    } else {
      const novoCharuto: Charuto = {
        ...(formData as Charuto),
        id: Date.now().toString(),
      }
      setCharutos((prev) => [...prev, novoCharuto])
    }

    setFormData({
      nome: "",
      marca: "",
      paisOrigem: "",
      preco: 0,
      quantidade: 1,
      dataCompra: new Date().toISOString().split("T")[0],
      foto: "",
    })
    setEditingCharuto(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (charuto: Charuto) => {
    setEditingCharuto(charuto)
    setFormData(charuto)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este charuto?")) {
      setCharutos((prev) => prev.filter((charuto) => charuto.id !== id))
    }
  }

  const moveToTasting = (charuto: Charuto) => {
    if (charuto.quantidade <= 0) {
      alert("Não há charutos disponíveis para degustação!")
      return
    }

    setSelectedCharutoForTasting(charuto)
    setIsTastingDialogOpen(true)
  }

  const handleStartTasting = (tastingData: any) => {
    if (!selectedCharutoForTasting) return

    // Reduzir quantidade no estoque
    setCharutos((prev) =>
      prev.map((c) => (c.id === selectedCharutoForTasting.id ? { ...c, quantidade: c.quantidade - 1 } : c)),
    )

    // Adicionar à degustação
    const charutoDegustacao = {
      id: Date.now().toString(),
      ...tastingData,
    }

    const savedTasting = localStorage.getItem("charutos-degustacao")
    const tastingList = savedTasting ? JSON.parse(savedTasting) : []
    localStorage.setItem("charutos-degustacao", JSON.stringify([...tastingList, charutoDegustacao]))

    alert("Degustação iniciada!")
    setSelectedCharutoForTasting(null)
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Estoque</h1>
          <p className="text-gray-600">Gerencie seus charutos disponíveis</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Charutos</p>
                  <p className="text-3xl font-bold text-gray-900">{charutos.length}</p>
                  <p className="text-xs text-gray-500">No estoque</p>
                </div>
                <Package className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Quantidade Total</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {charutos.reduce((acc, c) => acc + c.quantidade, 0)}
                  </p>
                  <p className="text-xs text-gray-500">Unidades</p>
                </div>
                <Package className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Total</p>
                  <p className="text-3xl font-bold text-gray-900">
                    R$ {charutos.reduce((acc, c) => acc + c.preco * c.quantidade, 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Investimento</p>
                </div>
                <Package className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disponíveis</p>
                  <p className="text-3xl font-bold text-gray-900">{charutos.filter((c) => c.quantidade > 0).length}</p>
                  <p className="text-xs text-gray-500">Para degustação</p>
                </div>
                <Package className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">Seus Charutos</CardTitle>
                <CardDescription className="text-gray-600">Adicione e organize seus charutos</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => {
                      setEditingCharuto(null)
                      setFormData({
                        nome: "",
                        marca: "",
                        paisOrigem: "",
                        preco: 0,
                        quantidade: 1,
                        dataCompra: new Date().toISOString().split("T")[0],
                        foto: "",
                      })
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Charuto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingCharuto ? "Editar Charuto" : "Adicionar Novo Charuto"}</DialogTitle>
                    <DialogDescription>Preencha as informações do charuto</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nome">Nome *</Label>
                        <Input
                          id="nome"
                          value={formData.nome || ""}
                          onChange={(e) => handleInputChange("nome", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="marca">Marca *</Label>
                        <Input
                          id="marca"
                          value={formData.marca || ""}
                          onChange={(e) => handleInputChange("marca", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="paisOrigem">País de Origem</Label>
                        <Input
                          id="paisOrigem"
                          value={formData.paisOrigem || ""}
                          onChange={(e) => handleInputChange("paisOrigem", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dataCompra">Data da Compra</Label>
                        <Input
                          id="dataCompra"
                          type="date"
                          value={formData.dataCompra || ""}
                          onChange={(e) => handleInputChange("dataCompra", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="preco">Preço (R$)</Label>
                        <Input
                          id="preco"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.preco || 0}
                          onChange={(e) => handleInputChange("preco", Number.parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="quantidade">Quantidade</Label>
                        <Input
                          id="quantidade"
                          type="number"
                          min="0"
                          value={formData.quantidade || 0}
                          onChange={(e) => handleInputChange("quantidade", Number.parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="foto">Foto do Charuto</Label>
                      <Input
                        id="foto"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (e) => {
                              handleInputChange("foto", e.target?.result as string)
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                        {editingCharuto ? "Salvar Alterações" : "Adicionar Charuto"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {charutos.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Nenhum charuto no estoque</p>
                <p className="text-sm text-gray-500">Adicione o primeiro charuto para começar</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {charutos.map((charuto) => (
                  <Card key={charuto.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900">{charuto.nome}</CardTitle>
                          <CardDescription className="text-gray-600">{charuto.marca}</CardDescription>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(charuto)}>
                            <Edit className="w-4 h-4 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(charuto.id)}>
                            <Trash2 className="w-4 h-4 text-gray-500" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 mb-4">
                        {charuto.paisOrigem && (
                          <p className="text-sm text-gray-600">
                            <strong>Origem:</strong> {charuto.paisOrigem}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          <strong>Quantidade:</strong>
                          <Badge variant={charuto.quantidade > 0 ? "default" : "destructive"} className="ml-2">
                            {charuto.quantidade}
                          </Badge>
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Preço:</strong> R$ {charuto.preco.toFixed(2)}
                        </p>
                      </div>
                      <Button
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => moveToTasting(charuto)}
                        disabled={charuto.quantidade <= 0}
                      >
                        Iniciar Degustação
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <TastingDialog
        charuto={selectedCharutoForTasting}
        isOpen={isTastingDialogOpen}
        onClose={() => setIsTastingDialogOpen(false)}
        onStartTasting={handleStartTasting}
      />
    </div>
  )
}
