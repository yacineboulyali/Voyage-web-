/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Screen, type City, type Mission } from './types';
import BottomNavBar from './components/BottomNavBar';
import SplashScreen from './views/SplashScreen';
import WelcomeScreen from './views/WelcomeScreen';
import MapJourneyScreen from './views/MapJourneyScreen';
import StoryScreen from './views/StoryScreen';
import ChallengeScreen from './views/ChallengeScreen';
import ProfileScreen from './views/ProfileScreen';
import LevelCompleteModal from './components/LevelCompleteModal';
import SettingsScreen from './views/SettingsScreen';
import GrammarQuestScreen from './views/GrammarQuestScreen';
import LeagueScreen from './views/LeagueScreen';
import LeagueDetailScreen from './views/LeagueDetailScreen';
import LeagueCreateScreen from './views/LeagueCreateScreen';
import VocabularyMatchScreen from './views/VocabularyMatchScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Splash);
  const [selectedCity, setSelectedCity] = useState<City | null>(null); 
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [completedCities, setCompletedCities] = useState<string[]>([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [userStats, setUserStats] = useState({
    xp: 1450,
    stars: 120,
    level: 4,
  });

  useEffect(() => {
    if (currentScreen === Screen.Splash) {
      const timer = setTimeout(() => setCurrentScreen(Screen.Welcome), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  useEffect(() => {
    async function fetchFirstMission() {
      if (selectedCity) {
        const { data: missions, error } = await supabase
          .from('missions')
          .select('*')
          .eq('city_id', selectedCity.id)
          .order('sort_order', { ascending: true });
        
        if (!error && missions && missions.length > 0) {
          // Find the first incomplete mission
          const nextMission = missions.find(m => !completedMissions.includes(m.id)) || missions[0];
          setSelectedMission(nextMission);
        }
      }
    }
    fetchFirstMission();
  }, [selectedCity, completedMissions]);

  const handleMissionComplete = (mission: Mission) => {
    setCompletedMissions(prev => [...prev, mission.id]);
    setUserStats(prev => ({ ...prev, xp: prev.xp + mission.xp_reward, stars: prev.stars + 5 }));
    
    // Check if there are more missions in this city
    async function checkNext() {
      if (selectedCity) {
        const { data: missions } = await supabase
          .from('missions')
          .select('*')
          .eq('city_id', selectedCity.id)
          .order('sort_order', { ascending: true });
        
        const currentIdx = missions?.findIndex(m => m.id === mission.id) ?? -1;
        if (missions && currentIdx < missions.length - 1) {
          // There is another mission in this city
          setSelectedMission(missions[currentIdx + 1]);
          setCurrentScreen(Screen.Story);
        } else {
          // City complete
          setCompletedCities(prev => [...prev, selectedCity.id]);
          setCurrentScreen(Screen.LevelComplete);
        }
      }
    }
    checkNext();
  };

  const showNavBar = [Screen.Map, Screen.Profile, Screen.Settings, Screen.GrammarQuest, Screen.League, Screen.LeagueDetail, Screen.LeagueCreate].includes(currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.Splash:
        return <SplashScreen />;
      case Screen.Welcome:
        return <WelcomeScreen onStart={() => setCurrentScreen(Screen.Map)} />;
      case Screen.Map:
        return (
          <MapJourneyScreen 
            stats={userStats} 
            completedCities={completedCities}
            completedMissions={completedMissions}
            onSelectCity={(city) => {
              setSelectedCity(city);
              setCurrentScreen(Screen.Story);
            }}
          />
        );
      case Screen.Story:
        if (!selectedCity) return <MapJourneyScreen stats={userStats} completedCities={completedCities} completedMissions={completedMissions} onSelectCity={(city) => { setSelectedCity(city); setCurrentScreen(Screen.Story); }} />;
        return (
          <StoryScreen 
            city={selectedCity} 
            mission={selectedMission || undefined}
            onClose={() => setCurrentScreen(Screen.Map)}
            onStartChallenge={() => setCurrentScreen(Screen.Challenge)}
          />
        );
      case Screen.Challenge:
        if (!selectedCity || !selectedMission) return <MapJourneyScreen stats={userStats} completedCities={completedCities} completedMissions={completedMissions} onSelectCity={(city) => { setSelectedCity(city); setCurrentScreen(Screen.Story); }} />;
        return (
          <ChallengeScreen 
            city={selectedCity} 
            missionId={selectedMission.id}
            onComplete={() => handleMissionComplete(selectedMission)}
            onBack={() => setCurrentScreen(Screen.Story)}
          />
        );
      case Screen.GrammarQuest:
        return <GrammarQuestScreen onBack={() => setCurrentScreen(Screen.Map)} />;
      case Screen.League:
        return (
          <LeagueScreen 
            onSelectLeague={(id) => {
              setSelectedLeagueId(id);
              setCurrentScreen(Screen.LeagueDetail);
            }}
            onCreateLeague={() => setCurrentScreen(Screen.LeagueCreate)}
            onBack={() => setCurrentScreen(Screen.Map)} 
          />
        );
      case Screen.LeagueCreate:
        return <LeagueCreateScreen onBack={() => setCurrentScreen(Screen.League)} onCreated={() => setCurrentScreen(Screen.League)} />;
      case Screen.LeagueDetail:
        return (
          <LeagueDetailScreen 
            leagueId={selectedLeagueId || 'bronze'} 
            onBack={() => setCurrentScreen(Screen.League)} 
          />
        );
      case Screen.VocabularyMatch:
        return <VocabularyMatchScreen onBack={() => setCurrentScreen(Screen.Map)} />;
      case Screen.Profile:
        return <ProfileScreen onBack={() => setCurrentScreen(Screen.Map)} onSettings={() => setCurrentScreen(Screen.Settings)} />;
      case Screen.Settings:
        return <SettingsScreen onBack={() => setCurrentScreen(Screen.Map)} />;
      case Screen.LevelComplete:
        return <LevelCompleteModal onClaim={() => setCurrentScreen(Screen.Map)} />;
      default:
        return <SplashScreen />;
    }
  };

  const getActiveTab = () => {
    switch (currentScreen) {
      case Screen.Map: return 'journey';
      case Screen.Profile: return 'profile';
      case Screen.Settings: return 'settings';
      case Screen.GrammarQuest:
      case Screen.VocabularyMatch: return 'explore';
      case Screen.League:
      case Screen.LeagueDetail:
      case Screen.LeagueCreate: return 'league';
      default: return 'journey';
    }
  };

  return (
    <div className="relative h-screen w-full bg-white overflow-hidden flex flex-col">
      <div className="flex-grow overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>

      {showNavBar && (
        <div className="flex-shrink-0">
          <BottomNavBar 
            activeTab={getActiveTab()} 
            onTabChange={(tab) => {
              switch (tab) {
                case 'journey': setCurrentScreen(Screen.Map); break;
                case 'profile': setCurrentScreen(Screen.Profile); break;
                case 'settings': setCurrentScreen(Screen.Settings); break;
                case 'explore': setCurrentScreen(Screen.GrammarQuest); break;
                case 'league': setCurrentScreen(Screen.League); break;
              }
            }} 
          />
        </div>
      )}
    </div>
  );
}
