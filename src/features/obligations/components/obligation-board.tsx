"use client";

import Link from "next/link";
import { CalendarDays, LayoutGrid, ListFilter, Table2 } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDateEs, formatRelativeDueDate } from "@/lib/date/obligations";
import type { DashboardObligation } from "@/modules/dashboard/data";

type ObligationBoardProps = {
  obligations: DashboardObligation[];
  locations: { name: string }[];
  members: { fullName: string }[];
};

export function ObligationBoard({ obligations, locations, members }: ObligationBoardProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [location, setLocation] = useState("all");
  const [responsible, setResponsible] = useState("all");

  const filtered = useMemo(() => {
    return obligations.filter((item) => {
      const normalizedSearch = search.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.typeName.toLowerCase().includes(normalizedSearch) ||
        item.assetName.toLowerCase().includes(normalizedSearch);
      const matchesStatus = status === "all" || item.computedStatus === status;
      const matchesLocation = location === "all" || item.locationName === location;
      const matchesResponsible = responsible === "all" || item.responsibleName === responsible;

      return matchesSearch && matchesStatus && matchesLocation && matchesResponsible;
    });
  }, [location, obligations, responsible, search, status]);

  const emptyFilters = (
    <EmptyState icon={ListFilter} title="Sin obligaciones para estos filtros" description="Ajusta los filtros o crea una nueva obligacion." />
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="obligation-search">Buscar</Label>
          <Input id="obligation-search" onChange={(event) => setSearch(event.target.value)} placeholder="ITV, seguro, dominio..." value={search} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="obligation-status">Estado</Label>
          <Select id="obligation-status" onChange={(event) => setStatus(event.target.value)} value={status}>
            <option value="all">Todos</option>
            <option value="expired">Vencido</option>
            <option value="critical">Urgente</option>
            <option value="warning">Proximo a vencer</option>
            <option value="normal">Correcto</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="obligation-location">Sede</Label>
          <Select id="obligation-location" onChange={(event) => setLocation(event.target.value)} value={location}>
            <option value="all">Todas</option>
            {locations.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="obligation-responsible">Responsable</Label>
          <Select id="obligation-responsible" onChange={(event) => setResponsible(event.target.value)} value={responsible}>
            <option value="all">Todos</option>
            {members.map((item) => (
              <option key={item.fullName} value={item.fullName}>
                {item.fullName}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">
            <Table2 className="mr-2 h-4 w-4" aria-hidden="true" />
            Tabla
          </TabsTrigger>
          <TabsTrigger value="cards">
            <LayoutGrid className="mr-2 h-4 w-4" aria-hidden="true" />
            Tarjetas
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarDays className="mr-2 h-4 w-4" aria-hidden="true" />
            Calendario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          {filtered.length === 0 ? (
            emptyFilters
          ) : (
            <>
              <div className="grid gap-3 md:hidden">
                {filtered.map((item) => (
                  <Link className="control-surface rounded-lg border p-4" href={`/dashboard/obligaciones/${item.id}`} key={item.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.typeName} - {item.assetName}
                        </p>
                      </div>
                      <StatusBadge status={item.computedStatus} />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Vencimiento</p>
                        <p className="font-medium">{formatDateEs(item.dueDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Estado temporal</p>
                        <p className="font-medium">{formatRelativeDueDate(item)}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-muted-foreground">Responsable</p>
                        <p className="font-medium">{item.responsibleName}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Card className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Obligacion</TableHead>
                      <TableHead>Activo</TableHead>
                      <TableHead>Vencimiento</TableHead>
                      <TableHead>Responsable</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Link className="font-medium text-primary hover:underline" href={`/dashboard/obligaciones/${item.id}`}>
                            {item.title}
                          </Link>
                          <p className="text-xs text-muted-foreground">{item.typeName}</p>
                        </TableCell>
                        <TableCell>{item.assetName}</TableCell>
                        <TableCell>
                          <span className="font-medium">{formatDateEs(item.dueDate)}</span>
                          <p className="text-xs text-muted-foreground">{formatRelativeDueDate(item)}</p>
                        </TableCell>
                        <TableCell>{item.responsibleName}</TableCell>
                        <TableCell>
                          <StatusBadge status={item.computedStatus} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="cards">
          {filtered.length === 0 ? (
            emptyFilters
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => (
                <Link
                  className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  href={`/dashboard/obligaciones/${item.id}`}
                  key={item.id}
                >
                  <Card className="h-full transition hover:border-primary/40 hover:shadow-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="leading-snug">{item.title}</CardTitle>
                        <StatusBadge status={item.computedStatus} />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Vencimiento</p>
                        <p className="font-medium">
                          {formatDateEs(item.dueDate)} - {formatRelativeDueDate(item)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{item.typeName}</Badge>
                        <Badge variant="outline">{item.assetName}</Badge>
                        <Badge variant="outline">{item.responsibleName}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar">
          {filtered.length === 0 ? (
            <EmptyState icon={CalendarDays} title="Sin fechas para estos filtros" description="Ajusta los filtros para ver el calendario operativo." />
          ) : (
            <Card>
              <CardContent className="grid gap-3 pt-5 md:grid-cols-2 xl:grid-cols-3">
                {filtered
                  .slice()
                  .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
                  .map((item) => (
                    <Link
                      className="rounded-md border p-3 transition hover:border-primary/40 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      href={`/dashboard/obligaciones/${item.id}`}
                      key={item.id}
                    >
                      <p className="text-sm font-semibold">{formatDateEs(item.dueDate)}</p>
                      <p className="mt-1 text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.responsibleName}</p>
                    </Link>
                  ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
