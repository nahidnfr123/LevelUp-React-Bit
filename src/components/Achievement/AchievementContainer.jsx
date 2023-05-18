import {useEffect, useState} from "react";
import Achievement from "./Achievement";
import * as React from "react";
import {useSelector} from "react-redux";

export default function AchievementContainer() {
  const [showAchievement, setShowAchievement] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setShowAchievement(true), 1000);

    // showAchievement false after 5 seconds
    // const timer2 = setInterval(() => {
    //   setShowAchievement(false)
    // }, 6000);
    return () => {
      clearTimeout(timer)
      // clearInterval(timer2)
    }
  }, []);

  const auth = useSelector((state) => state.auth)
  const user = auth.user

  const toggleCard = () => {
    setShowAchievement(!showAchievement)
  }

  return (
      <>
        {
            ((user && user?.userLevel && !user?.userLevel?.seen) && showAchievement) &&
            <Achievement
                currentLevel={user?.userLevel?.level}
                previousLevel={user?.userLevel?.previous_level}
                uuid={user?.userLevel?.uuid}
                toggleCard={toggleCard}
            />
        }
      </>
  )
}
