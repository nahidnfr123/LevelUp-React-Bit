import Particle from "./Particle";
import party from "party-js";
import './Achievement.scss';
import {useEffect} from "react";
import $api from "../../services/api.service";

export default function Achievement({currentLevel, previousLevel, uuid, toggleCard}) {

// document.querySelector(".sparkle-button").addEventListener("click", function (e) {
  useEffect(() => {
    const RANDOM = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
    const PARTICLES = document.querySelectorAll('.particle')
    PARTICLES.forEach(P => {
      P.setAttribute('style', `
        	--x: ${RANDOM(20, 80)};
        	--y: ${RANDOM(20, 80)};
        	--duration: ${RANDOM(6, 20)};
        	--delay: ${RANDOM(1, 10)};
        	--alpha: ${RANDOM(40, 90) / 100};
        	--origin-x: ${Math.random() > 0.5 ? RANDOM(300, 800) * -1 : RANDOM(300, 800)}%;
        	--origin-y: ${Math.random() > 0.5 ? RANDOM(300, 800) * -1 : RANDOM(300, 800)}%;
        	--size: ${RANDOM(40, 90) / 100};
        `)
    })
    const card = document.querySelector(".badge")
    if (card) {
      party.confetti(card, {
        count: party.variation.range(160, 200),
        size: party.variation.range(0.2, 1.4),
        speed: party.variation.range(500, 1000),
      });
    }
  })
// });

  const animateButton = () => {
    const card = document.querySelector(".badge")
    if (card) {
      party.confetti(card, {
        count: party.variation.range(100, 120),
        size: party.variation.range(0.2, 1.4),
        speed: party.variation.range(400, 500),
      });
    }
  };

  const markAsSeen = async () => {
    animateButton()
    const achievementCard = document.getElementsByClassName('achievementCard')

    if (achievementCard) achievementCard[0].classList.add('hide')
    if (uuid) await $api.get('/user-level/seen/' + uuid)

    const timer = setInterval(() => {
      toggleCard()
    }, 1000);
    clearInterval(timer)
  }

  return (
      <div className='achievementCard'>
        <div className="sparkleButton" onClick={animateButton}>
          <div className='badge'>
            <img className='badge-svg previous' src={previousLevel?.logo} alt="" height='150' width='150'/>
            <img className='badge-svg current ' src={currentLevel?.logo} alt="" height='150' width='150'/>
          </div>
          <span aria-hidden="true" className="particle-pen">
                    {[...Array(26)].map((i, n) => <Particle key={n + 'particles'}/>)}
                </span>
        </div>

        <div className='levelText'>
          <h3 className="previous">{previousLevel?.name}</h3>
          <h3 className="current">{currentLevel?.name}</h3>
        </div>
        <button className='okButton' onClick={markAsSeen}>Ok</button>
      </div>
  )
}
