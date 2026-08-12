import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { BiMap, BiBus, BiSupport } from "react-icons/bi";

function Navbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const indicatorRef = useRef(null);
  const containerRef = useRef(null);
  const iconsRef = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    { id: 'map', path: '/', icon: <BiMap className="w-7 h-7" /> },
    { id: 'bus', path: '/bus-stops', icon: <BiBus className="w-7 h-7" /> },
    { id: 'help', path: '/help', icon: <BiSupport className="w-7 h-7" /> }
  ];

  useEffect(() => {
    const currentIndex = items.findIndex(item => item.path === location.pathname);
    if (currentIndex !== -1 && currentIndex !== activeIndex) {
      setActiveIndex(currentIndex);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (iconsRef.current[activeIndex] && indicatorRef.current && containerRef.current) {
      const activeElement = iconsRef.current[activeIndex];
      const containerRect = containerRef.current.getBoundingClientRect();
      const elRect = activeElement.getBoundingClientRect();

      const offsetLeft = elRect.left - containerRect.left + (elRect.width / 2) - 26;

      gsap.to(indicatorRef.current, {
        x: offsetLeft,
        duration: 0.6,
        ease: "elastic.out(1, 0.7)",
      });

      gsap.fromTo(activeElement,
        { y: 0, scale: 1 },
        { y: -6, scale: 1.15, duration: 0.3, ease: "power2.out", yoyo: true, repeat: 1 }
      );
    }
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-[30px] left-1/2 -translate-x-1/2 bg-[#ff6392] rounded-[50px] px-6 py-3 flex md:hidden gap-6 z-[1000] shadow-[0_10px_25px_rgba(255,99,146,0.3)]"
    >
      <div
        ref={indicatorRef}
        className="absolute w-[52px] h-[52px] bg-[#ffe4eb] rounded-full top-1/2 -mt-[26px] left-0 z-0 shadow-[0_4px_12px_rgba(0,0,0,0.1)] box-border"
      />

      {items.map((item, index) => (
        <div
          key={item.id}
          ref={el => iconsRef.current[index] = el}
          onClick={() => {
            setActiveIndex(index);
            navigate(item.path);
          }}
          className={`relative z-10 cursor-pointer flex items-center justify-center w-12 h-12 transition-colors duration-[400ms] ease-in-out ${activeIndex === index ? 'text-[#ff6392]' : 'text-white'}`}
        >
          {item.icon}
        </div>
      ))}
    </div>
  )
}

export default Navbar