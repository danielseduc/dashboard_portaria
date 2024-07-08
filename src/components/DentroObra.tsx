// components/CardFetch.tsx
import React, { useEffect, useState } from 'react';

const CardFetch: React.FC = () => {
  const [qtdDentro, setQtdDentro] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/getFuncdentro`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setQtdDentro(data[0].qtd_dentro); // Acessando o primeiro objeto do array e a propriedade 'qtd_dentro'
        } else {
          throw new Error('Resposta da API vazia ou formato incorreto');
        }
      } catch (error: any) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const formattedNumber = qtdDentro ? parseInt(qtdDentro).toLocaleString('pt-BR') : '';

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '6px', textAlign: 'center' }}>      
      <p style={{ fontSize: '100px', fontWeight: 'bold' }}>{formattedNumber}</p>
      <h2>Funcionários na obra</h2>
    </div>
  );
};

export default CardFetch;
