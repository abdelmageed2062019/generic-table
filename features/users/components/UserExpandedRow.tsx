"use client";

import { useTranslations } from "next-intl";
import { useLinkedEntities } from "../hooks/useLinkedEntities";
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface UserExpandedRowProps {
     userId: string;
}

export function UserExpandedRow({ userId }: UserExpandedRowProps) {
     const t = useTranslations("users.expanded");
     const { data: entities, isLoading } = useLinkedEntities(userId);

     return (
          <div className="bg-muted/40 border-t px-6 py-4">
               <div className="rounded-md border bg-background overflow-hidden">
                    <Table>
                         <TableHeader>
                              <TableRow className="bg-muted/60 hover:bg-muted/60">
                                   <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        {t("linkedEntities")}
                                   </TableHead>
                                   <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        {t("linkedEmails")}
                                   </TableHead>
                                   <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        {t("usageQueries")}
                                   </TableHead>
                                   <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        {t("lastActive")}
                                   </TableHead>
                              </TableRow>
                         </TableHeader>
                         <TableBody>
                              {isLoading ? (
                                   Array.from({ length: 2 }).map((_, i) => (
                                        <TableRow key={i}>
                                             {Array.from({ length: 4 }).map((_, j) => (
                                                  <TableCell key={j}>
                                                       <Skeleton className="h-4 w-full" />
                                                  </TableCell>
                                             ))}
                                        </TableRow>
                                   ))
                              ) : !entities?.length ? (
                                   <TableRow>
                                        <TableCell
                                             colSpan={4}
                                             className="text-center text-sm text-muted-foreground py-6"
                                        >
                                             {t("noEntities")}
                                        </TableCell>
                                   </TableRow>
                              ) : (
                                   entities.map((entity) => (
                                        <TableRow key={entity.id} className="hover:bg-muted/30">
                                             <TableCell className="text-sm font-medium">
                                                  {entity.entity}
                                             </TableCell>
                                             <TableCell className="text-sm text-muted-foreground">
                                                  {entity.email}
                                             </TableCell>
                                             <TableCell className="text-sm">
                                                  {entity.usageQueries.toLocaleString()}
                                             </TableCell>
                                             <TableCell className="text-sm text-muted-foreground">
                                                  {entity.lastActive}
                                             </TableCell>
                                        </TableRow>
                                   ))
                              )}
                         </TableBody>
                    </Table>
               </div>
          </div>
     );
}