"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type AssetListItem = {
  id: string;
  name: string;
  assetType: string;
  status: string;
  locationName: string;
  responsibleName: string;
  obligationsCount: number;
  documentsCount: number;
};

export function AssetsList({ assets }: { assets: AssetListItem[] }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");

  const types = [...new Set(assets.map((asset) => asset.assetType))];
  const filtered = useMemo(
    () =>
      assets.filter((asset) => {
        const matchesSearch =
          asset.name.toLowerCase().includes(search.toLowerCase()) ||
          asset.assetType.toLowerCase().includes(search.toLowerCase()) ||
          asset.responsibleName.toLowerCase().includes(search.toLowerCase());
        return matchesSearch && (type === "all" || asset.assetType === type) && (status === "all" || asset.status === status);
      }),
    [assets, search, status, type]
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="asset-search">Buscar</Label>
          <Input id="asset-search" onChange={(event) => setSearch(event.target.value)} placeholder="Furgoneta, extintor..." value={search} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="asset-type">Tipo</Label>
          <Select id="asset-type" onChange={(event) => setType(event.target.value)} value={type}>
            <option value="all">Todos</option>
            {types.map((assetType) => (
              <option key={assetType} value={assetType}>
                {assetType}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="asset-status">Estado</Label>
          <Select id="asset-status" onChange={(event) => setStatus(event.target.value)} value={status}>
            <option value="all">Todos</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="retired">Retirado</option>
          </Select>
        </div>
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={Search} title="Sin activos" description="No hay activos que coincidan con los filtros." />
      ) : (
        <>
        <div className="grid gap-3 md:hidden">
          {filtered.map((asset) => (
            <Link className="control-surface rounded-lg border p-4" href={`/dashboard/activos/${asset.id}`} key={asset.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{asset.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{asset.assetType} - {asset.locationName}</p>
                </div>
                <Badge variant={asset.status === "active" ? "success" : "outline"}>{asset.status === "active" ? "Al dia" : asset.status}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Responsable</p>
                  <p className="font-medium">{asset.responsibleName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Relacionados</p>
                  <p className="font-medium">{asset.obligationsCount} obl. / {asset.documentsCount} docs</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Card className="hidden md:block">
          <CardContent className="pt-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Sede</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Relacionados</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>
                      <Link className="font-medium text-primary hover:underline" href={`/dashboard/activos/${asset.id}`}>
                        {asset.name}
                      </Link>
                    </TableCell>
                    <TableCell>{asset.assetType}</TableCell>
                    <TableCell>{asset.locationName}</TableCell>
                    <TableCell>{asset.responsibleName}</TableCell>
                    <TableCell>
                      {asset.obligationsCount} obligaciones · {asset.documentsCount} documentos
                    </TableCell>
                    <TableCell>
                      <Badge variant={asset.status === "active" ? "success" : "outline"}>{asset.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        </>
      )}
    </div>
  );
}
