import React from 'react';
import { JsonEditor } from 'json-edit-react';

interface ProofDisplayProps {
  proof: any;
  setProof: (data: any) => void;
}

const ProofDisplay: React.FC<ProofDisplayProps> = ({ proof, setProof }) => (
  <div className="my-8 w-full mx-auto flex flex-col items-center gap-4">
    <p className="text-center text-lg mt-4 text-gray-600 mb-4">
      gm {JSON.parse(proof.proofData?.claimInfo?.context)?.extractedParameters?.username}!
    </p>
    <JsonEditor
      data={proof?.proof}
      restrictAdd={true}
      restrictDelete={true}
      collapse={1}
      restrictEdit={true}
      setData={setProof}
      className="w-full"
      maxWidth={'100%'}
      rootName="proof"
    />
  </div>
);

export default ProofDisplay;
