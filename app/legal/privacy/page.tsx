import {
  LegalBullet,
  LegalPage,
  LegalSection,
} from "@/components/layout/page-scaffold";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Política de Privacidade"
      headline="Como usamos seus dados no RudFit AI"
      description="Esta política resume, de forma objetiva, quais dados o app usa para autenticação, cálculo de metas, registro de refeições e análise por IA."
    >
      <LegalSection
        title="Dados de conta"
        subtitle="Informações usadas para criar e manter seu acesso."
      >
        <LegalBullet
          title="Login"
          description="Podemos tratar nome, username, e-mail e credenciais de acesso para autenticar sua conta e manter sua sessão ativa."
        />
        <LegalBullet
          title="Identificação da conta"
          description="Seu perfil pode incluir identificadores internos para associar refeições, metas e histórico ao seu usuário."
        />
      </LegalSection>

      <LegalSection
        title="Dados corporais e metas"
        subtitle="Usados para personalizar calorias e distribuição diária de macros."
      >
        <LegalBullet
          title="Perfil informado"
          description="Podemos tratar idade, gênero, altura, peso atual, peso inicial, peso meta, rotina, nível de atividade e objetivo."
        />
        <LegalBullet
          title="Cálculo automático"
          description="Esses dados podem ser enviados ao servidor para calcular ou recalcular metas diárias."
        />
      </LegalSection>

      <LegalSection
        title="Fotos e registros de refeição"
        subtitle="Necessários para registrar refeições manualmente ou com IA."
      >
        <LegalBullet
          title="Análise de imagem"
          description="Fotos enviadas podem ser processadas por serviços de IA para sugerir alimentos detectados e estimativas nutricionais."
        />
        <LegalBullet
          title="Histórico alimentar"
          description="Registros de refeições, horários e totais nutricionais ficam associados à sua conta para exibição no app."
        />
      </LegalSection>
    </LegalPage>
  );
}
