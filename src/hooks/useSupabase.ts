/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { type Challenge, type Mission } from '../types';

export function useSupabaseCities() {
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCities() {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching cities:', error);
      } else {
        const mappedCities = (data || []).map(city => ({
          id: city.city_id,
          name: city.city_name_fr,
          arabicName: city.city_name_ar,
          description: city.description_fr,
          arabicDescription: city.description_ar || '',
          focus: city.focus_fr,
          points: 500, // Placeholder
          image: city.illustration_url,
          iconUrl: city.icon_name,
          status: 'active', // Default for now
          stepNum: 1,
          totalSteps: 10
        }));
        setCities(mappedCities);
      }
      setLoading(false);
    }

    fetchCities();
  }, []);

  return { cities, loading };
}

export function useSupabaseMissions(cityId: string) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMissions() {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('city_id', cityId)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching missions:', error);
      } else {
        setMissions(data || []);
      }
      setLoading(false);
    }

    if (cityId) fetchMissions();
  }, [cityId]);

  return { missions, loading };
}

export function useSupabaseQuestions(missionId: string) {
  const [questions, setQuestions] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('mission_id', missionId)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching questions:', error);
      } else {
        // Map Supabase question to app Challenge type
        const mappedQuestions: Challenge[] = (data || []).map((q: any) => {
          const type = mapType(q.question_type);
          let options = q.options;
          let content = q.presentation_fr ? [q.presentation_fr] : undefined;

          if (type === 'fill-in-blanks') {
            options = q.options?.map((opt: any, idx: number) => ({
              id: String(idx),
              text: typeof opt === 'string' ? opt : (opt.text_fr || opt.label || '')
            }));
            content = [q.question_fr];
          } else if (type === 'matching') {
            // For matching, we might need a special structure
            options = q.options?.pairs?.map((p: any, idx: number) => ({
              id: String(idx),
              text: p.item,
              match: p.match
            }));
          } else {
            options = q.options?.map((opt: any, idx: number) => ({
              id: opt.id || String(idx),
              text: opt.text_fr || opt.label || opt.text || '',
              label: opt.label || String.fromCharCode(65 + idx)
            }));
          }

          return {
            id: q.id,
            type,
            title: q.question_fr.substring(0, 30) + '...',
            question: q.question_fr,
            arabicQuestion: q.question_ar,
            options,
            correctOptionId: q.correct_answer,
            hint: q.hint_fr,
            content,
            feedbackPositive: q.feedback_positive_fr,
            feedbackNegative: q.feedback_negative_fr
          };
        });
        setQuestions(mappedQuestions);
      }
      setLoading(false);
    }

    if (missionId) fetchQuestions();
  }, [missionId]);

  return { questions, loading };
}

function mapType(dbType: string): any {
  const normalized = (dbType || '').toLowerCase().replace(/_/g, '-');
  switch (normalized) {
    case 'qcm':
    case 'multiple-choice':
    case 'vrai-faux':
    case 'true-false':
    case 'scenario-decision':
    case 'scenario-cascade':
    case 'team-roles':
    case 'time-attack':
    case 'audio-challenge':
      return 'decision';
    case 'error-detection':
    case 'glitch':
      return 'glitch';
    case 'fill-blanks':
    case 'fill-in-blanks':
      return 'fill-in-blanks';
    case 'ranking':
    case 'sorting-challenge':
      return 'ranking';
    case 'matching':
      return 'matching';
    case 'short-answer':
      return 'short-answer';
    case 'puzzle-riddle':
    case 'riddle':
      return 'riddle';
    case 'scenario-dialogue':
      return 'dialogue';
    case 'mosaic':
      return 'mosaic';
    default:
      return 'decision';
  }
}
