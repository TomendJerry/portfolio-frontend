"use client";

import { useEffect, useState } from "react";
import { AuditAPI, AuditLog } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AuditPage() {
  const { token } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      AuditAPI.getLogs(token)
        .then(setLogs)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [token]);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Security Access Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Device ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Browser/OS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {loading ? (
                <TableRow><TableCell colSpan={5}>Loading logs...</TableCell></TableRow>
            ) : logs.map((log) => {
                // LOGIKA PERBAIKAN WAKTU:
                // Tambahkan 'Z' agar JavaScript tahu ini UTC, 
                // sehingga toLocaleString bisa menambah +7 jam untuk Asia/Jakarta
                const utcDate = log.timestamp.endsWith('Z') 
                    ? new Date(log.timestamp) 
                    : new Date(log.timestamp + 'Z');

                return (
                <TableRow key={log.id}>
                    <TableCell className="text-xs whitespace-nowrap">
                    {utcDate.toLocaleString("id-ID", {
                        timeZone: "Asia/Jakarta",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                    }).replace(/\./g, ':')} 
                    </TableCell>
                    <TableCell><Badge variant="outline">{log.ip_address}</Badge></TableCell>
                    <TableCell className="font-mono text-[10px]">{log.device_id}</TableCell>
                    <TableCell>
                    {/* Perbaikan: Gunakan variant='secondary' atau className agar sesuai Shadcn */}
                    <Badge className="bg-blue-600 hover:bg-blue-700">{log.action}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                    {log.user_agent}
                    </TableCell>
                </TableRow>
                );
            })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}