import Particle from "./Particle";
import party from "party-js";
import './Achievement.scss';
import {useEffect} from "react";

export default function Achievement() {


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
        	--size: ${RANDOM(40, 60) / 100};
        `)
    })
    const card = document.querySelector(".achievementCard")
    party.confetti(card, {
      count: party.variation.range(80, 150),
      size: party.variation.range(0.2, 1.4),
      speed: party.variation.range(500, 1000),
    });
  })
// });
  return (
      <div className='achievementCard'>
        <div className="sparkle-button">
          <div className='badge'>
            <img className='badge-svg previous' src="./Superstar.png" alt="" height='150' width='150'/>
            <img className='badge-svg current ' src="./Semi-Pro.png" alt="" height='150' width='150'/>
          </div>
          <span aria-hidden="true" className="particle-pen">
                    {[...Array(20)].map((i, n) => <Particle key={n + 'particles'}/>)}
                </span>
        </div>

        <div className='level-text'>
          <h3 className="previous">Superstar</h3>
          <h3 className="current">Semi-Pro</h3>
        </div>

      </div>
  )
}
