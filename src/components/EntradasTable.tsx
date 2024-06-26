import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Entrada {
  entradaid: number;
  dentro: number;
  funcionarioid: string | null;
  funcionario: string;
  funcao: string;
  contratante: string;
  contratada: string;
  datahoraentrada: string;
  datahorasaida: string | null;
  portaria_entrada: string;
  porteiro_entrada: string;
  liberador: string | null;
  equipamentoid: string | null;
  equipamento: string | null;
  tipo: string | null;
  placa: string | null;
  entradamanual: number;
  portariasaida: string | null;
  porteirosaida: string | null;
  saidamanual: number | null;
}

const EntradasTable: React.FC = () => {
  const rowsPerPage = 10;
  const [data, setData] = useState<Entrada[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(rowsPerPage);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [nome, setNome] = useState('');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const getData = async () => {
    try {
      const query = new URLSearchParams({
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(nome && { nome }),
      });

      const response = await fetch(`/api/getEntradas?${query.toString()}`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Erro ao buscar entradas:', error);
    }
  };

  useEffect(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      getData();
    }, 500); // Ajuste o tempo de debounce conforme necessário (500ms neste exemplo)

    setTypingTimeout(timeout);

    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [startDate, endDate, nome]);

  const handlePreviousPage = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - rowsPerPage);
      setEndIndex(endIndex - rowsPerPage);
    }
  };

  const handleNextPage = () => {
    if (endIndex < data.length) {
      setStartIndex(startIndex + rowsPerPage);
      setEndIndex(endIndex + rowsPerPage);
    }
  };

  return (
    <>
      <div>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Data Início"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="Data Fim"
        />
        <input
          type="text"
          value={nome}
          onChange={(e) => {
            setNome(e.target.value);
            if (typingTimeout) {
              clearTimeout(typingTimeout);
            }
          }}
          placeholder="Nome do Funcionário"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Funcionário</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Contratante</TableHead>
            <TableHead>Contratada</TableHead>
            <TableHead>Data/Hora Entrada</TableHead>
            <TableHead>Data/Hora Saída</TableHead>
            <TableHead>Portaria Entrada</TableHead>
            <TableHead>Porteiro Entrada</TableHead>
            <TableHead>Liberador</TableHead>
            <TableHead>Equipamento</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Placa</TableHead>
            <TableHead>Entrada Manual</TableHead>
            <TableHead>Portaria Saída</TableHead>
            <TableHead>Porteiro Saída</TableHead>
            <TableHead>Saída Manual</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.slice(startIndex, endIndex).map((entrada) => (
              <TableRow key={entrada.entradaid}>
                <TableCell className="font-medium">{entrada.entradaid}</TableCell>
                <TableCell>{entrada.funcionario}</TableCell>
                <TableCell>{entrada.funcao}</TableCell>
                <TableCell>{entrada.contratante}</TableCell>
                <TableCell>{entrada.contratada}</TableCell>
                <TableCell>{entrada.datahoraentrada}</TableCell>
                <TableCell>{entrada.datahorasaida ? entrada.datahorasaida : 'Na obra'}</TableCell>
                <TableCell>{entrada.portaria_entrada}</TableCell>
                <TableCell>{entrada.porteiro_entrada}</TableCell>
                <TableCell>{entrada.liberador}</TableCell>
                <TableCell>{entrada.equipamento}</TableCell>
                <TableCell>{entrada.tipo}</TableCell>
                <TableCell>{entrada.placa}</TableCell>
                <TableCell>{entrada.entradamanual}</TableCell>
                <TableCell>{entrada.portariasaida}</TableCell>
                <TableCell>{entrada.porteirosaida}</TableCell>
                <TableCell>{entrada.saidamanual}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={17} className="text-center">
                Nenhum dado encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationPrevious onClick={handlePreviousPage} />
        <PaginationContent>
          <PaginationItem>{startIndex / rowsPerPage + 1}</PaginationItem>
        </PaginationContent>
        <PaginationNext onClick={handleNextPage} />
      </Pagination>
    </>
  );
};

export default EntradasTable;
