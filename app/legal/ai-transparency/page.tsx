import {
  LegalBullet,
  LegalPage,
  LegalSection,
} from "@/components/layout/page-scaffold";

export default function AiTransparencyPage() {
  return (
    <LegalPage
      title="Uso de IA"
      headline="Como a IA participa das estimativas"
      description="A IA do RudFit AI ajuda a reconhecer alimentos em fotos e estimar calorias e macros. Ela foi criada para agilizar o registro, não para substituir acompanhamento profissional."
    >
      <LegalSection title="O que a IA faz">
        <LegalBullet
          title="Leitura de foto"
          description="Quando você envia uma imagem da refeição, a IA pode analisar a foto para sugerir alimentos detectados."
        />
        <LegalBullet
          title="Estimativas nutricionais"
          description="Com base nos itens sugeridos e nas quantidades estimadas, o sistema calcula uma estimativa inicial de calorias e macros."
        />
      </LegalSection>

      <LegalSection
        title="O que você deve revisar"
        subtitle="A revisão manual continua sendo uma etapa essencial do fluxo."
      >
        <LegalBullet
          title="Itens detectados"
          description="Confira nomes e quantidades antes de salvar a refeição."
        />
        <LegalBullet
          title="Limitações"
          description="Estimativas podem variar conforme preparo, porções e ingredientes não visíveis na foto."
        />
      </LegalSection>
    </LegalPage>
  );
}
