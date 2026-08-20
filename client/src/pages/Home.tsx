/**
 * Atlas Adventure Club design: a parchment expedition desk, an accurate geographic U.S. map, navy map ink,
 * Trail Orange achievements, and opt-in, low-volume sound cues for young geography explorers.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature as topologyFeature } from "topojson-client";
import { stateDiscovery } from "@/data/stateDiscovery";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Compass,
  MapPinned,
  PencilLine,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

type Stage = "study" | "multiple" | "challenge";
type TestStage = Exclude<Stage, "study">;

type StateData = {
  state: string;
  capital: string;
  code: string;
  x: number;
  y: number;
};

type QuizQuestion = {
  item: StateData;
  options?: string[];
};

type HistoryEntry = {
  id: string;
  name: string;
  score: number;
  stage: TestStage;
  date: string;
};

const states: StateData[] = [
  { state: "Alabama", capital: "Montgomery", code: "AL", x: 63, y: 65 },
  { state: "Alaska", capital: "Juneau", code: "AK", x: 14, y: 83 },
  { state: "Arizona", capital: "Phoenix", code: "AZ", x: 33, y: 65 },
  { state: "Arkansas", capital: "Little Rock", code: "AR", x: 57, y: 58 },
  { state: "California", capital: "Sacramento", code: "CA", x: 25, y: 54 },
  { state: "Colorado", capital: "Denver", code: "CO", x: 43, y: 51 },
  { state: "Connecticut", capital: "Hartford", code: "CT", x: 84, y: 37 },
  { state: "Delaware", capital: "Dover", code: "DE", x: 80, y: 45 },
  { state: "Florida", capital: "Tallahassee", code: "FL", x: 75, y: 78 },
  { state: "Georgia", capital: "Atlanta", code: "GA", x: 69, y: 64 },
  { state: "Hawaii", capital: "Honolulu", code: "HI", x: 28, y: 91 },
  { state: "Idaho", capital: "Boise", code: "ID", x: 34, y: 35 },
  { state: "Illinois", capital: "Springfield", code: "IL", x: 61, y: 42 },
  { state: "Indiana", capital: "Indianapolis", code: "IN", x: 66, y: 43 },
  { state: "Iowa", capital: "Des Moines", code: "IA", x: 58, y: 37 },
  { state: "Kansas", capital: "Topeka", code: "KS", x: 52, y: 50 },
  { state: "Kentucky", capital: "Frankfort", code: "KY", x: 69, y: 52 },
  { state: "Louisiana", capital: "Baton Rouge", code: "LA", x: 57, y: 70 },
  { state: "Maine", capital: "Augusta", code: "ME", x: 90, y: 24 },
  { state: "Maryland", capital: "Annapolis", code: "MD", x: 78, y: 46 },
  { state: "Massachusetts", capital: "Boston", code: "MA", x: 84, y: 33 },
  { state: "Michigan", capital: "Lansing", code: "MI", x: 67, y: 35 },
  { state: "Minnesota", capital: "Saint Paul", code: "MN", x: 56, y: 29 },
  { state: "Mississippi", capital: "Jackson", code: "MS", x: 61, y: 67 },
  { state: "Missouri", capital: "Jefferson City", code: "MO", x: 57, y: 50 },
  { state: "Montana", capital: "Helena", code: "MT", x: 43, y: 29 },
  { state: "Nebraska", capital: "Lincoln", code: "NE", x: 52, y: 43 },
  { state: "Nevada", capital: "Carson City", code: "NV", x: 30, y: 48 },
  { state: "New Hampshire", capital: "Concord", code: "NH", x: 86, y: 29 },
  { state: "New Jersey", capital: "Trenton", code: "NJ", x: 81, y: 42 },
  { state: "New Mexico", capital: "Santa Fe", code: "NM", x: 42, y: 61 },
  { state: "New York", capital: "Albany", code: "NY", x: 78, y: 34 },
  { state: "North Carolina", capital: "Raleigh", code: "NC", x: 74, y: 57 },
  { state: "North Dakota", capital: "Bismarck", code: "ND", x: 52, y: 28 },
  { state: "Ohio", capital: "Columbus", code: "OH", x: 70, y: 43 },
  { state: "Oklahoma", capital: "Oklahoma City", code: "OK", x: 53, y: 57 },
  { state: "Oregon", capital: "Salem", code: "OR", x: 27, y: 38 },
  { state: "Pennsylvania", capital: "Harrisburg", code: "PA", x: 76, y: 40 },
  { state: "Rhode Island", capital: "Providence", code: "RI", x: 85, y: 38 },
  { state: "South Carolina", capital: "Columbia", code: "SC", x: 72, y: 62 },
  { state: "South Dakota", capital: "Pierre", code: "SD", x: 52, y: 35 },
  { state: "Tennessee", capital: "Nashville", code: "TN", x: 66, y: 57 },
  { state: "Texas", capital: "Austin", code: "TX", x: 48, y: 70 },
  { state: "Utah", capital: "Salt Lake City", code: "UT", x: 37, y: 51 },
  { state: "Vermont", capital: "Montpelier", code: "VT", x: 83, y: 29 },
  { state: "Virginia", capital: "Richmond", code: "VA", x: 75, y: 51 },
  { state: "Washington", capital: "Olympia", code: "WA", x: 27, y: 27 },
  { state: "West Virginia", capital: "Charleston", code: "WV", x: 72, y: 48 },
  { state: "Wisconsin", capital: "Madison", code: "WI", x: 62, y: 33 },
  { state: "Wyoming", capital: "Cheyenne", code: "WY", x: 43, y: 42 },
];

const STAGE_LABELS: Record<Stage, string> = {
  study: "Study Map",
  multiple: "Quick Pick",
  challenge: "Capital Sprint",
};

const historyKey = "trailtrek-score-history";

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function makeTest(stage: TestStage): QuizQuestion[] {
  return shuffle(states)
    .slice(0, 20)
    .map((item) => {
      if (stage === "multiple") {
        const decoys = shuffle(states.filter((candidate) => candidate.capital !== item.capital))
          .slice(0, 3)
          .map((candidate) => candidate.capital);
        return { item, options: shuffle([item.capital, ...decoys]) };
      }
      return { item };
    });
}

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z]/g, "");
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(iso));
}
const stateByFips = new Map(stateDiscovery.map((item) => [item.fips, item]));
const compactMapStateLabels = new Set(["Connecticut", "Delaware", "Hawaii", "Maryland", "Massachusetts", "New Hampshire", "New Jersey", "Rhode Island", "Vermont"]);

function useTrailAudio() {
  const contextRef = useRef<AudioContext | null>(null);
  const loopRef = useRef<number | null>(null);
  const musicStepRef = useRef(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const getContext = useCallback(() => {
    if (typeof window === "undefined" || !window.AudioContext) return null;
    if (!contextRef.current) contextRef.current = new window.AudioContext();
    if (contextRef.current.state === "suspended") void contextRef.current.resume();
    return contextRef.current;
  }, []);
  const playTone = useCallback((frequency: number, duration: number, tone: OscillatorType, volume: number, delay = 0) => {
    const context = getContext();
    if (!context) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const startAt = context.currentTime + delay;
    oscillator.type = tone;
    oscillator.frequency.setValueAtTime(frequency, startAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.03);
  }, [getContext]);
  const stopMusic = useCallback(() => {
    if (loopRef.current !== null) window.clearInterval(loopRef.current);
    loopRef.current = null;
    setSoundEnabled(false);
  }, []);
  const startMusic = useCallback(() => {
    getContext();
    musicStepRef.current = 0;
    const notes = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23];
    const playStep = () => {
      const step = musicStepRef.current % notes.length;
      playTone(notes[step], 0.32, "sine", 0.022);
      if (step % 4 === 0) playTone(notes[step] / 2, 0.28, "triangle", 0.012, 0.02);
      musicStepRef.current += 1;
    };
    playStep();
    loopRef.current = window.setInterval(playStep, 490);
    setSoundEnabled(true);
  }, [getContext, playTone]);
  useEffect(() => () => {
    if (loopRef.current !== null) window.clearInterval(loopRef.current);
    void contextRef.current?.close();
  }, []);
  return {
    soundEnabled,
    toggleSound: () => (soundEnabled ? stopMusic() : startMusic()),
    click: () => { if (soundEnabled) playTone(523.25, 0.08, "sine", 0.05); },
    answer: (correct: boolean) => {
      if (!soundEnabled) return;
      if (correct) {
        playTone(523.25, 0.12, "sine", 0.06);
        playTone(659.25, 0.18, "sine", 0.06, 0.1);
      } else {
        playTone(220, 0.16, "triangle", 0.045);
        playTone(185, 0.2, "triangle", 0.04, 0.1);
      }
    },
  };
}
function MapBoard({ active, onSelect, onTap }: { active: StateData; onSelect?: (item: StateData) => void; onTap?: () => void }) {
  const [stateShapes, setStateShapes] = useState<any[]>([]);
  const mapProjection = useMemo(() => geoAlbersUsa().scale(1300).translate([487.5, 305]), []);
  const statePath = useMemo(() => geoPath(mapProjection), [mapProjection]);
  const selectState = useCallback((item: (typeof stateDiscovery)[number]) => {
    const matchingState = states.find((entry) => entry.state === item.state);
    onTap?.();
    if (matchingState) onSelect?.(matchingState);
  }, [onSelect, onTap]);

  useEffect(() => {
    let isCurrent = true;
    fetch("/maps/us-states-10m.json")
      .then((response) => response.json())
      .then((topology) => {
        const collection = topologyFeature(topology as any, topology.objects.states as any) as any;
        if (isCurrent) setStateShapes(collection.features.filter((shape: any) => stateByFips.has(String(shape.id).padStart(2, "0"))));
      })
      .catch(() => { if (isCurrent) setStateShapes([]); });
    return () => { isCurrent = false; };
  }, []);

  return (
    <div className="map-board" aria-label="Interactive U.S. state map with state capital markers">
      <div className="map-legend">U.S. ATLAS · TAP A STATE</div>
      <svg className="us-geography" viewBox="0 0 975 610" role="img" aria-label="Accurate interactive map of the 50 United States">
        {stateShapes.map((shape) => {
          const item = stateByFips.get(String(shape.id).padStart(2, "0"));
          if (!item) return null;
          const isActive = item.state === active.state;
          const labelPoint = statePath.centroid(shape);
          const displayLabel = compactMapStateLabels.has(item.state) ? item.code : item.state;
          return (
            <g className={`us-state-group ${isActive ? "is-active" : ""}`} key={item.fips}>
              <path
                aria-label={`${item.state}, capital ${item.capital}`}
                aria-pressed={isActive}
                d={statePath(shape) ?? ""}
                onClick={() => selectState(item)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectState(item);
                  }
                }}
                role="button"
                tabIndex={0}
              />
              {Number.isFinite(labelPoint[0]) && Number.isFinite(labelPoint[1]) && <text aria-hidden="true" className={`map-state-name ${compactMapStateLabels.has(item.state) ? "is-compact" : ""}`} x={labelPoint[0]} y={labelPoint[1]}>{displayLabel}</text>}
              <title>{`${item.state} — ${item.capital}`}</title>
            </g>
          );
        })}
        <g className="capital-marker-layer" aria-hidden="true">
          {stateDiscovery.map((item) => {
            const point = mapProjection([item.longitude, item.latitude]);
            if (!point) return null;
            const isActive = item.state === active.state;
            return <g className={`capital-marker ${isActive ? "is-active" : ""}`} key={item.code} transform={`translate(${point[0]},${point[1]})`}><circle r={isActive ? 6.5 : 4.5} /><text y={isActive ? -11 : -8}>{item.code}</text></g>;
          })}
        </g>
      </svg>
      <div className="map-focus-card">
        <MapPinned size={15} />
        <span>{active.state}</span>
        <strong>{active.capital}</strong>
      </div>
      <div className="map-source-note">Borders: U.S. Census via us-atlas · Capital coordinates: xFront</div>
      {stateShapes.length === 0 && <div className="map-loading">Loading verified state boundaries…</div>}
    </div>
  );
}

function StateDiscoveryCard({ item }: { item: StateData }) {
  const discovery = stateDiscovery.find((entry) => entry.state === item.state);
  if (!discovery) return null;
  return (
    <article className="state-discovery-card" aria-label={`${item.state} discovery details`}>
      <figure className="landmark-photo">
        <img alt={`${discovery.landmark} in ${item.state}`} loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} src={discovery.imageUrl} />
        <figcaption><a href={discovery.imagePageUrl} rel="noreferrer" target="_blank">{discovery.landmark} photo</a> · {discovery.imageCredit}</figcaption>
      </figure>
      <div className="discovery-copy">
        <span className="discovery-kicker">LANDMARK · {discovery.landmark}</span>
        <p><strong>Did you know?</strong> {discovery.stateFact}</p>
        <p><strong>History trail:</strong> {discovery.historyFact}</p>
        <a className="fact-source-link" href={discovery.factSourceUrl} rel="noreferrer" target="_blank">Read the source <ChevronRight size={14} /></a>
      </div>
    </article>
  );
}

function StagePath({ active, onSelect }: { active: Stage; onSelect: (stage: Stage) => void }) {
  const stages: { id: Stage; icon: typeof BookOpen; kicker: string; title: string }[] = [
    { id: "study", icon: BookOpen, kicker: "STAGE 01", title: "Study map" },
    { id: "multiple", icon: CircleHelp, kicker: "STAGE 02", title: "Quick pick" },
    { id: "challenge", icon: PencilLine, kicker: "STAGE 03", title: "Capital sprint" },
  ];
  return (
    <nav className="stage-path" aria-label="Learning stages">
      <div className="path-line" />
      {stages.map((stage, index) => {
        const Icon = stage.icon;
        return (
          <button
            className={`stage-stop ${active === stage.id ? "is-current" : ""}`}
            key={stage.id}
            onClick={() => onSelect(stage.id)}
            type="button"
          >
            <span className="stage-number">0{index + 1}</span>
            <span className="stage-icon"><Icon size={18} strokeWidth={2.3} /></span>
            <span className="stage-copy"><small>{stage.kicker}</small><strong>{stage.title}</strong></span>
          </button>
        );
      })}
      <div className="finish-flag"><Trophy size={17} /></div>
    </nav>
  );
}

export default function Home() {
  const trailAudio = useTrailAudio();
  const [stage, setStage] = useState<Stage>("study");
  const [selectedState, setSelectedState] = useState<StateData>(states[4]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answer, setAnswer] = useState("");
  const [pendingResult, setPendingResult] = useState<{ score: number; stage: TestStage } | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyFilter, setHistoryFilter] = useState<"all" | TestStage>("all");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(historyKey);
      if (stored) setHistory(JSON.parse(stored));
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(historyKey, JSON.stringify(history));
    } catch {
      // The game remains usable if browser storage is unavailable.
    }
  }, [history]);

  const currentQuestion = quiz[questionIndex];
  const focusState = currentQuestion?.item ?? selectedState;
  const activeHistory = useMemo(
    () => history
      .filter((entry) => historyFilter === "all" || entry.stage === historyFilter)
      .sort((a, b) => b.score - a.score || new Date(b.date).getTime() - new Date(a.date).getTime()),
    [history, historyFilter],
  );

  const startTest = (testStage: TestStage) => {
    trailAudio.click();
    const nextQuiz = makeTest(testStage);
    setStage(testStage);
    setQuiz(nextQuiz);
    setQuestionIndex(0);
    setScore(0);
    setSubmitted(false);
    setIsCorrect(null);
    setAnswer("");
    setSelectedState(nextQuiz[0].item);
  };

  const chooseStage = (nextStage: Stage) => {
    trailAudio.click();
    setStage(nextStage);
    setSubmitted(false);
    setIsCorrect(null);
    setAnswer("");
    if (nextStage === "study") setQuiz([]);
  };

  const openStudyMap = () => {
    chooseStage("study");
    window.requestAnimationFrame(() => {
      const mapTarget = document.getElementById("study-map");
      mapTarget?.scrollIntoView({ behavior: "smooth", block: "start" });
      mapTarget?.focus({ preventScroll: true });
    });
  };

  const checkAnswer = (chosen: string) => {
    if (!currentQuestion || submitted) return;
    const expected = stage === "multiple" ? currentQuestion.item.capital : currentQuestion.item.state;
    const correct = normalize(chosen) === normalize(expected);
    setAnswer(chosen);
    setSubmitted(true);
    setIsCorrect(correct);
    trailAudio.answer(correct);
    if (correct) setScore((value) => value + 1);
  };

  const moveForward = () => {
    if (questionIndex === quiz.length - 1) {
      setPendingResult({ score: score + (isCorrect ? 1 : 0), stage: stage as TestStage });
      return;
    }
    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);
    setSelectedState(quiz[nextIndex].item);
    setSubmitted(false);
    setIsCorrect(null);
    setAnswer("");
  };

  const saveResult = () => {
    const cleanName = playerName.trim();
    if (!pendingResult || !cleanName) return;
    const nextEntry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: cleanName.slice(0, 28),
      score: pendingResult.score,
      stage: pendingResult.stage,
      date: new Date().toISOString(),
    };
    setHistory((entries) => [nextEntry, ...entries].slice(0, 40));
    setPlayerName("");
    setPendingResult(null);
    setStage("study");
    setQuiz([]);
  };

  const studyIndex = states.findIndex((item) => item.state === selectedState.state);
  const testScore = score + (submitted && isCorrect ? 1 : 0);

  return (
    <div className="min-h-screen app-shell">
      <header className="topbar">
        <a className="brand-lockup" href="#top" aria-label="TrailTrek home">
          <img alt="TrailTrek compass pin logo" className="brand-mark" src="/assets/trailtrek-logo.png" />
          <span><strong>TrailTrek</strong><small>STATES &amp; CAPITALS</small></span>
        </a>
        <div className="topbar-note"><Compass size={16} /> <span>Learn it. Pin it. Own it.</span></div>
        <button aria-label={trailAudio.soundEnabled ? "Mute TrailTrek sounds" : "Turn on TrailTrek sounds"} aria-pressed={trailAudio.soundEnabled} className="sound-toggle" onClick={trailAudio.toggleSound} type="button">
          {trailAudio.soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}<span>{trailAudio.soundEnabled ? "Sound on" : "Sound off"}</span>
        </button>
        <a className="leaderboard-link" href="#leaderboard"><Trophy size={16} /> Trail Board</a>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><span /> A GEOGRAPHY EXPEDITION</div>
            <h1>Pin the capital.<br /><em>Claim the trail.</em></h1>
            <p>Explore every state, find it on the map, then race through a 20-question challenge.</p>
            <div className="hero-actions">
              <button aria-label="Explore the interactive U.S. state map" className="btn-primary" onClick={openStudyMap} type="button"><MapPinned size={18} /> Explore the map <ArrowRight size={18} /></button>
              <a className="text-action" href="#leaderboard">See the trail board <ChevronRight size={16} /></a>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <img alt="" src="/assets/trailtrek-hero.png" />
            <div className="hero-stamp"><Star fill="currentColor" size={14} /> 50 STATES<br />1 BIG TRAIL</div>
          </div>
        </section>

        <section className="expedition-section" aria-label="States and capitals learning expedition">
          <div className="section-intro">
            <div><span className="section-kicker">YOUR ROUTE</span><h2>Choose your next<br /><em>trail marker.</em></h2></div>
            <p>Start with the map, then take both 20-question tests to build your geography superpower.</p>
          </div>
          <StagePath active={stage} onSelect={chooseStage} />

          <div className="learning-desk" id="study-map" tabIndex={-1}>
            <aside className="locator-panel">
              <div className="locator-header"><span><MapPinned size={17} /> LIVE LOCATION</span><small>tap a pin</small></div>
              <MapBoard active={focusState} onSelect={(item) => { setSelectedState(item); if (stage === "study") setQuiz([]); }} onTap={trailAudio.click} />
              <div className="map-tip"><Sparkles size={15} /><span>Tap a real state shape. The highlighted state is orange.</span></div>
            </aside>

            <section className="task-panel">
              {stage === "study" && (
                <div className="study-view">
                  <div className="task-topline"><span className="passport-tag">STUDY FIELD NOTES</span><span className="count-label">{studyIndex + 1} / 50</span></div>
                  <div className="study-card">
                    <div className="study-orbit"><span>STATE</span><strong>{selectedState.code}</strong></div>
                    <div className="study-details">
                      <p>YOU ARE EXPLORING</p>
                      <h3>{selectedState.state}</h3>
                      <div className="capital-label"><span>CAPITAL CITY</span><strong>{selectedState.capital}</strong></div>
                    </div>
                  </div>
                  <StateDiscoveryCard item={selectedState} />
                  <div className="study-controls">
                    <button className="round-control" aria-label="Previous state" onClick={() => { trailAudio.click(); setSelectedState(states[(studyIndex + states.length - 1) % states.length]); }} type="button"><ArrowLeft size={19} /></button>
                    <button className="study-next" onClick={() => { trailAudio.click(); setSelectedState(states[(studyIndex + 1) % states.length]); }} type="button">Next state <ArrowRight size={18} /></button>
                  </div>
                  <div className="knowledge-strip"><span><BookOpen size={16} /> TIP</span><p>Say the state and capital together twice. Your brain loves a matching pair!</p></div>
                  <div className="test-ready-card">
                    <div><span>READY TO TEST YOURSELF?</span><strong>Try 20 quick picks</strong></div>
                    <button className="btn-outline" onClick={() => startTest("multiple")} type="button">Start stage 2 <ArrowRight size={17} /></button>
                  </div>
                </div>
              )}

              {stage === "multiple" && quiz.length === 0 && (
                <StarterCard stage="multiple" onStart={() => startTest("multiple")} />
              )}
              {stage === "challenge" && quiz.length === 0 && (
                <StarterCard stage="challenge" onStart={() => startTest("challenge")} />
              )}

              {(stage === "multiple" || stage === "challenge") && currentQuestion && (
                <div className="quiz-view">
                  <div className="task-topline"><span className="passport-tag">{stage === "multiple" ? "QUICK PICK TEST" : "CAPITAL SPRINT TEST"}</span><span className="count-label">{questionIndex + 1} / 20</span></div>
                  <div className="quiz-progress"><span style={{ width: `${((questionIndex + (submitted ? 1 : 0)) / 20) * 100}%` }} /></div>
                  <div className="question-score"><span><Star size={15} fill="currentColor" /> {testScore} correct</span><span>GOAL: 20</span></div>
                  <div className="question-card">
                    <div className="question-number">{questionIndex + 1}</div>
                    <p>{stage === "multiple" ? "What is the capital of" : "Which state is home to the capital"}</p>
                    <h3>{stage === "multiple" ? currentQuestion.item.state : currentQuestion.item.capital}<span>?</span></h3>
                    {stage === "multiple" ? (
                      <div className="choice-grid">
                        {currentQuestion.options?.map((option, index) => {
                          const selected = answer === option;
                          const isAnswer = option === currentQuestion.item.capital;
                          return (
                            <button
                              className={`choice-button ${submitted && selected ? (isCorrect ? "is-correct" : "is-wrong") : ""} ${submitted && isAnswer ? "show-correct" : ""}`}
                              disabled={submitted}
                              key={option}
                              onClick={() => checkAnswer(option)}
                              type="button"
                            >
                              <span>{String.fromCharCode(65 + index)}</span>{option}{submitted && isAnswer && <Check size={18} />}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="answer-box">
                        <label htmlFor="state-answer">Type the state name</label>
                        <div><input autoComplete="off" disabled={submitted} id="state-answer" onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && answer.trim()) checkAnswer(answer); }} placeholder="Your answer…" value={answer} /><button disabled={submitted || !answer.trim()} onClick={() => checkAnswer(answer)} type="button">Check</button></div>
                      </div>
                    )}
                  </div>
                  {submitted && (
                    <div className={`feedback-card ${isCorrect ? "positive" : "retry"}`}>
                      {isCorrect ? <Check size={21} /> : <CircleHelp size={21} />}
                      <div><strong>{isCorrect ? "Nice navigation!" : "Good try, explorer."}</strong><p>{isCorrect ? "You found the right answer." : `The answer is ${stage === "multiple" ? currentQuestion.item.capital : currentQuestion.item.state}. Remember it for the next trail!`}</p></div>
                      <button onClick={moveForward} type="button">{questionIndex === 19 ? "Finish test" : "Next"} <ArrowRight size={17} /></button>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </section>

        <section className="trail-board-section" id="leaderboard">
          <div className="board-art"><img alt="Trail badge illustration" src="/assets/badge-art.png" /></div>
          <div className="board-intro"><span className="section-kicker">FRIENDLY COMPETITION</span><h2>The Trail<br /><em>Board</em></h2><p>After every test, write your name to add your score. This board is saved on this device, so your group can take turns and see who leads the expedition.</p><div className="board-legend"><span><Award size={16} /> High score wins</span><span><MapPinned size={16} /> 20 points max</span></div></div>
          <div className="leaderboard-card">
            <div className="leaderboard-top"><div><p>LOCAL SCORE HISTORY</p><strong>Top explorers</strong></div><Trophy size={25} /></div>
            <div className="filter-row"><button className={historyFilter === "all" ? "active" : ""} onClick={() => setHistoryFilter("all")} type="button">All tests</button><button className={historyFilter === "multiple" ? "active" : ""} onClick={() => setHistoryFilter("multiple")} type="button">Quick pick</button><button className={historyFilter === "challenge" ? "active" : ""} onClick={() => setHistoryFilter("challenge")} type="button">Sprint</button></div>
            <div className="score-list">
              {activeHistory.length === 0 ? <div className="empty-board"><MapPinned size={26} /><strong>Your trail board is ready.</strong><span>Complete a test and be the first explorer on the list.</span></div> : activeHistory.slice(0, 7).map((entry, index) => <div className="score-row" key={entry.id}><span className={`place place-${index + 1}`}>{index + 1}</span><div><strong>{entry.name}</strong><small>{entry.stage === "multiple" ? "Quick pick" : "Capital sprint"} · {formatDate(entry.date)}</small></div><b>{entry.score}<small>/20</small></b></div>)}
            </div>
          </div>
        </section>
      </main>

      <footer><div><img alt="" src="/assets/trailtrek-logo.png" /><span>TrailTrek <small>STATES &amp; CAPITALS</small></span></div><p>One state at a time. One big map in your mind.</p></footer>

      {pendingResult && (
        <div className="result-overlay" role="dialog" aria-modal="true" aria-labelledby="result-title">
          <div className="result-card">
            <button className="modal-close" aria-label="Close" onClick={() => setPendingResult(null)} type="button"><X size={18} /></button>
            <div className="result-badge"><Trophy size={31} /></div>
            <span className="passport-tag">TEST COMPLETE</span>
            <h2 id="result-title">You mapped a great route!</h2>
            <div className="big-score"><strong>{pendingResult.score}</strong><span>out of 20<br />correct</span></div>
            <p className="result-message">{pendingResult.score === 20 ? "Perfect score! Your map skills are shining." : pendingResult.score >= 15 ? "Excellent work—your geography skills are growing strong." : "Every trail makes you stronger. Study the map and race again!"}</p>
            <label className="name-label" htmlFor="player-name">Add your name to the Trail Board</label>
            <input autoFocus id="player-name" maxLength={28} onChange={(event) => setPlayerName(event.target.value)} placeholder="Explorer name" value={playerName} />
            <button className="btn-primary full-button" disabled={!playerName.trim()} onClick={saveResult} type="button">Save my score <ChevronRight size={18} /></button>
            <button className="modal-text-button" onClick={() => { setPendingResult(null); setStage("study"); setQuiz([]); }} type="button">Skip for now</button>
          </div>
        </div>
      )}
    </div>
  );
}

function StarterCard({ stage, onStart }: { stage: TestStage; onStart: () => void }) {
  const isMultiple = stage === "multiple";
  return (
    <div className="starter-card">
      <span className="passport-tag">{isMultiple ? "STAGE 02" : "STAGE 03"}</span>
      <div className="starter-icon">{isMultiple ? <CircleHelp size={27} /> : <PencilLine size={27} />}</div>
      <h3>{isMultiple ? "Ready for a quick pick?" : "Ready to sprint?"}</h3>
      <p>{isMultiple ? "Pick the right capital from four choices. You will answer 20 questions." : "Type the state that matches each capital. You will answer 20 questions."}</p>
      <div className="starter-rule"><Star size={16} fill="currentColor" /> Every correct answer earns one trail star.</div>
      <button className="btn-primary" onClick={onStart} type="button">Start 20 questions <ArrowRight size={18} /></button>
    </div>
  );
}
