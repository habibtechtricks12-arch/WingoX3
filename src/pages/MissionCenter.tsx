import React from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { Target, CheckCircle2, Award, Gift, Sparkles } from 'lucide-react';

export const MissionCenter: React.FC = () => {
  const { missions, claimMission } = useApp();

  return (
    <div className="min-h-screen bg-slate-100 pb-24">
      <Header title="Daily Missions" />

      <main className="max-w-lg mx-auto px-4 py-3.5 space-y-4">
        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-950/80">
              MISSION REWARDS
            </span>
            <h3 className="font-extrabold text-base text-slate-950">Daily Tasks</h3>
            <p className="text-xs text-amber-950/90 mt-0.5">
              Complete tasks daily to earn extra demo vouchers!
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold shadow-md">
            <Target className="w-7 h-7" />
          </div>
        </div>

        {/* Missions List */}
        <div className="space-y-3">
          {missions.map((mission) => {
            const isCompleted = mission.progress >= mission.total;
            const progressPercent = Math.min(100, (mission.progress / mission.total) * 100);

            return (
              <div
                key={mission.id}
                className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900">{mission.title}</h4>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold font-mono">
                      +৳ {mission.reward.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{mission.desc}</p>

                  <div className="space-y-1 pt-1">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Progress: {mission.progress} / {mission.total}
                    </span>
                  </div>
                </div>

                <button
                  disabled={!isCompleted || mission.claimed}
                  onClick={() => claimMission(mission.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    mission.claimed
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : isCompleted
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm active:scale-95'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {mission.claimed ? 'Claimed' : isCompleted ? 'Claim' : 'In Progress'}
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
