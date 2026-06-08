import {
  Activity,
  Armchair,
  Dumbbell,
  Flame,
  Footprints,
  Gauge,
  HeartPulse,
  Leaf,
  RefreshCw,
  Scale,
  Target,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  ActivityLevelType,
  GenderType,
  GoalType,
} from "@/lib/types/onboarding";

export interface OnboardingStepMeta {
  id: string;
  shortLabel: string;
  group: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
}

export const ONBOARDING_STEPS: OnboardingStepMeta[] = [
  {
    id: "goal",
    shortLabel: "Objetivo",
    group: "Seu perfil",
    title: "Qual é o seu objetivo?",
    subtitle: "Escolha o foco principal do seu plano nutricional.",
    icon: Target,
  },
  {
    id: "gender",
    shortLabel: "Gênero",
    group: "Seu perfil",
    title: "Qual é o seu sexo biológico?",
    subtitle: "Usamos essa informação para calcular suas necessidades calóricas.",
    icon: User,
  },
  {
    id: "metrics",
    shortLabel: "Medidas",
    group: "Seu perfil",
    title: "Suas medidas",
    subtitle: "Informe idade, altura e peso atuais com precisão.",
    icon: Scale,
  },
  {
    id: "target",
    shortLabel: "Meta",
    group: "Seu perfil",
    title: "Qual é o seu peso meta?",
    subtitle: "Definimos o trajeto entre seu peso atual e a meta desejada.",
    icon: TrendingDown,
  },
  {
    id: "routine",
    shortLabel: "Rotina",
    group: "Estilo de vida",
    title: "Como é sua rotina durante o dia?",
    subtitle: "Considere o dia a dia fora dos treinos.",
    icon: Armchair,
  },
  {
    id: "activity",
    shortLabel: "Atividade",
    group: "Estilo de vida",
    title: "Nível de atividade",
    subtitle: "Com que frequência você pratica exercícios?",
    icon: Activity,
  },
  {
    id: "intensity",
    shortLabel: "Ritmo",
    group: "Intensidade",
    title: "Qual ritmo você prefere seguir?",
    subtitle: "Isso ajusta o déficit ou superávit calórico do plano.",
    icon: Gauge,
  },
];

export const ONBOARDING_STEP_COUNT = ONBOARDING_STEPS.length;

export interface GoalOption {
  value: GoalType;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const GOAL_OPTIONS: GoalOption[] = [
  {
    value: GoalType.LoseWeight,
    label: "Perder peso",
    description: "Reduzir gordura com déficit calórico",
    icon: TrendingDown,
  },
  {
    value: GoalType.GainMuscle,
    label: "Ganhar músculo",
    description: "Hipertrofia com superávit controlado",
    icon: Dumbbell,
  },
  {
    value: GoalType.MaintainWeight,
    label: "Manter peso",
    description: "Equilíbrio calórico no dia a dia",
    icon: Scale,
  },
  {
    value: GoalType.BodyRecomposition,
    label: "Recomposição",
    description: "Perder gordura e ganhar massa magra",
    icon: RefreshCw,
  },
];

export interface GenderOption {
  value: GenderType;
  label: string;
  icon: LucideIcon;
}

export const GENDER_OPTIONS: GenderOption[] = [
  { value: GenderType.Male, label: "Masculino", icon: User },
  { value: GenderType.Female, label: "Feminino", icon: User },
  { value: GenderType.Other, label: "Outro", icon: Users },
];

export interface SelectionOption {
  value: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const ROUTINE_OPTIONS: SelectionOption[] = [
  {
    value: 1,
    title: "Maioria do tempo sentado",
    description: "Pouca movimentação ao longo do dia.",
    icon: Armchair,
  },
  {
    value: 2,
    title: "Me movimento algumas vezes",
    description: "Levanto com frequência ou faço pequenos deslocamentos.",
    icon: Footprints,
  },
  {
    value: 3,
    title: "Passo boa parte do dia em pé",
    description: "Trabalho ou rotina exige ficar em pé constantemente.",
    icon: Activity,
  },
  {
    value: 4,
    title: "Esforço físico frequente",
    description: "Atividades exigentes fazem parte do dia.",
    icon: Flame,
  },
];

export const ACTIVITY_OPTIONS: SelectionOption[] = [
  {
    value: ActivityLevelType.Sedentary,
    title: "Sedentário",
    description: "Pouco ou nenhum exercício",
    icon: Armchair,
  },
  {
    value: ActivityLevelType.LightlyActive,
    title: "Levemente ativo",
    description: "1–3 dias de exercício por semana",
    icon: Footprints,
  },
  {
    value: ActivityLevelType.ModeratelyActive,
    title: "Moderadamente ativo",
    description: "3–5 dias de exercício por semana",
    icon: Activity,
  },
  {
    value: ActivityLevelType.VeryActive,
    title: "Muito ativo",
    description: "6–7 dias de exercício por semana",
    icon: HeartPulse,
  },
  {
    value: ActivityLevelType.Athlete,
    title: "Atleta",
    description: "Exercício intenso diário",
    icon: Dumbbell,
  },
];

export const INTENSITY_OPTIONS: SelectionOption[] = [
  {
    value: 1,
    title: "Leve e sustentável",
    description: "Mudanças graduais, mais fáceis de manter.",
    icon: Leaf,
  },
  {
    value: 2,
    title: "Equilibrado",
    description: "Bom progresso mantendo equilíbrio.",
    icon: Gauge,
  },
  {
    value: 3,
    title: "Mais intenso",
    description: "Resultados mais rápidos com maior disciplina.",
    icon: TrendingUp,
  },
];

export const FIRST_ACCESS_TIPS = [
  "Leva cerca de 2 minutos para concluir.",
  "Você pode recalcular tudo depois no perfil.",
  "Metas baseadas em evidências nutricionais.",
];

export const RECALCULATE_TIPS = [
  "Seus dados atuais já foram pré-preenchidos.",
  "Altere só o que mudou desde o último cálculo.",
  "Calorias e macros serão atualizados no servidor.",
];
