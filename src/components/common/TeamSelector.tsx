import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { authApi } from '@/features/auth/api/authApi';
import type { SportTeamPair } from '@/types/common';
import type { Sport, Team } from '@/features/auth/types/auth';

interface TeamSelectorProps {
  value: SportTeamPair[];
  onChange: (value: SportTeamPair[]) => void;
  error?: string;
}

interface TeamLabel {
  sportName: string;
  teamName: string;
}

export function TeamSelector({ value, onChange, error }: TeamSelectorProps) {
  const [selectedSportId, setSelectedSportId] = useState<number | null>(null);
  const [labelCache, setLabelCache] = useState<Record<string, TeamLabel>>({});

  const { data: sports, isLoading: sportsLoading } = useQuery<Sport[]>({
    queryKey: ['sports'],
    queryFn: authApi.getSports,
  });

  const { data: teams, isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ['sports', selectedSportId, 'teams'],
    queryFn: () => authApi.getTeams(selectedSportId!),
    enabled: selectedSportId !== null,
  });

  const handleAddTeam = (teamId: string) => {
    if (!selectedSportId) return;
    const tid = Number(teamId);

    const alreadyExists = value.some((v) => v.sportId === selectedSportId && v.teamId === tid);
    if (alreadyExists) return;

    const sport = sports?.find((s) => s.id === selectedSportId);
    const team = teams?.find((t) => t.id === tid);
    if (sport && team) {
      setLabelCache((prev) => ({
        ...prev,
        [`${selectedSportId}-${tid}`]: { sportName: sport.name, teamName: team.name },
      }));
    }

    onChange([...value, { sportId: selectedSportId, teamId: tid }]);
  };

  const handleRemoveTeam = (sportId: number, teamId: number) => {
    setLabelCache((prev) => {
      const next = { ...prev };
      delete next[`${sportId}-${teamId}`];
      return next;
    });
    onChange(value.filter((v) => !(v.sportId === sportId && v.teamId === teamId)));
  };

  const getTeamLabel = (sportId: number, teamId: number) => {
    const cached = labelCache[`${sportId}-${teamId}`];
    if (cached) return `${cached.sportName} - ${cached.teamName}`;
    return `종목${sportId} - 팀${teamId}`;
  };

  return (
    <div className="space-y-3">
      {/* 종목 → 팀 2단계 선택 */}
      <div className="flex gap-2">
        <div className="flex-1">
          {sportsLoading ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <Select
              value={selectedSportId?.toString() ?? ''}
              onValueChange={(v) => setSelectedSportId(Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="종목 선택" />
              </SelectTrigger>
              <SelectContent>
                {sports?.map((sport) => (
                  <SelectItem key={sport.id} value={sport.id.toString()}>
                    {sport.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex-1">
          {teamsLoading ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <Select disabled={!selectedSportId} onValueChange={handleAddTeam} value="">
              <SelectTrigger>
                <SelectValue placeholder="팀 선택" />
              </SelectTrigger>
              <SelectContent>
                {teams?.map((team) => (
                  <SelectItem key={team.id} value={team.id.toString()}>
                    <span className="flex items-center gap-2">
                      {team.logo && <img src={team.logo} alt="" className="h-4 w-4 rounded-full" />}
                      {team.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* 선택된 팀 Badge 목록 */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((pair) => (
            <Badge
              key={`${pair.sportId}-${pair.teamId}`}
              variant="secondary"
              className="gap-1 pr-1"
            >
              {getTeamLabel(pair.sportId, pair.teamId)}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 hover:bg-transparent"
                aria-label="팀 삭제"
                onClick={() => handleRemoveTeam(pair.sportId, pair.teamId)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
