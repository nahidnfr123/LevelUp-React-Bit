import {useEffect, useState} from "react";
import Achievement from "./Achievement";
import * as React from "react";

export default function AchievementContainer () {
  const [showAchievement, setShowAchievement] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setShowAchievement(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
      <>
        {showAchievement && <Achievement/>}
      </>
  )
}
