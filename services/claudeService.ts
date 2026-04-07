
export interface ProposalRequest {
  clientName: string;
  projectType: string;
  value: number;
  details: string;
}

export const generateProposal = async (data: ProposalRequest): Promise<string> => {
  const response = await fetch('/api/claude/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao gerar proposta com Claude');
  }

  const result = await response.json();
  return result.text;
};
