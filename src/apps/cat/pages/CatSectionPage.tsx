import { useNavigate, useParams } from 'react-router-dom';
import { BookOpen, Brain, Calculator, ArrowRight, Clock } from 'lucide-react';
import { ALL_CAT_MODULES } from '../data/contentMap';
import { CatSection } from '../data/types';

const SECTION_CONFIG: Record<string, { title: string; icon: any; color: string; description: string }> = {
  quant: {
    title: 'Quantitative Aptitude',
    icon: Calculator,
    color: 'text-blue-600 bg-blue-50',
    description: 'Master arithmetic, algebra, geometry, and modern math.'
  },
  dilr: {
    title: 'Data Interpretation & Logical Reasoning',
    icon: Brain,
    color: 'text-purple-600 bg-purple-50',
    description: 'Solve complex puzzles and data sets with logic.'
  },
  varc: {
    title: 'Verbal Ability & Reading Comprehension',
    icon: BookOpen,
    color: 'text-green-600 bg-green-50',
    description: 'Improve reading speed and verbal logic.'
  }
};

export default function CatSectionPage() {
  const { sectionId } = useParams();
  const navigate = useNavigate();

  // sectionId comes from URL (quant, dilr, varc). Map to Enum (QUANT, DILR, VARC)
  const sectionEnum = sectionId?.toUpperCase() as CatSection;
  const config = SECTION_CONFIG[sectionId || 'quant'];

  const modules = ALL_CAT_MODULES.filter(m => m.topic.section === sectionEnum)
    .sort((a, b) => a.topic.order - b.topic.order);

  if (!config) return <div>Invalid Section</div>;

  const Icon = config.icon;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className={`inline-flex p-3 rounded-xl ${config.color} mb-4`}>
          <Icon className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{config.title}</h1>
        <p className="text-lg text-slate-600">{config.description}</p>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((module) => (
          <div
            key={module.topic.id}
            onClick={() => navigate(`/cat/${sectionId}/${module.topic.id}`)}
            className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all cursor-pointer flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                {module.topic.title}
              </h3>
              <p className="text-sm text-slate-500 mb-3">{module.topic.description}</p>

              <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {module.lessons.length} Lessons
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {module.lessons.reduce((acc, l) => acc + l.durationMinutes, 0)} mins
                </div>
              </div>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-rose-600 transition-colors" />
          </div>
        ))}

        {modules.length === 0 && (
          <div className="col-span-full py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">More modules coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
