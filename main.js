import gsap from "gsap";
import * as THREE from 'three';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';

const lenis = new Lenis();

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

raf()

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
camera.position.z = 3;
scene.add(camera);

const sphereGeometry = new THREE.IcosahedronGeometry(1.7, 128, 128);
const sphereMaterial = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
  uniforms: {
    uTime: { value: 0 },
    uColor: { value:0.0 }
  },
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.y=-2.2
scene.add(sphere);
const canvas = document.querySelector('canvas.webgl')
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = ()=>{
  const elapsedTime = clock.getElapsedTime();
  sphereMaterial.uniforms.uTime.value = elapsedTime;
  renderer.render(scene, camera);
  sphere.rotation.x = elapsedTime*.02
  sphere.rotation.y = elapsedTime*.02
  window.requestAnimationFrame(tick);
}
tick()


const cursor = document.querySelector('.cursor');
const cursorText = document.querySelector('.cursor-inner p');




gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({
  defaults:{
    ease:'none'
  },
  scrollTrigger: {
    trigger:'.hero',
    start:'top top',
    end:'+=800',
    scrub:2,
    pin:true,
  }
})

tl.to('.hero-text-1',{
  opacity:0,
  y:-20
})
.to(sphere.position,{
  y:0,
  z:-1
},'<')
.to(sphereMaterial.uniforms.uColor,{
  value:1.0,
  duration:.5
},'-=.3')
.from('.hero-text-2',{
  y:20
})
.to('.hero-text-2',{
  opacity:1,
},'<')


const projectsTl = gsap.timeline({
  defaults:{
    ease:'none'
  },
  scrollTrigger: {
    trigger:'.projects',
    start:'top top',
    end:'bottom bottom',
    scrub:1,
    pin:'.images-section',
  }
})

projectsTl.to('.image1',{
  clipPath:'inset(0px 0px 100%)',
})
.to('.image2',{
  clipPath:'inset(0px 0px 100%)',
})
.to('.image3',{
  clipPath:'inset(0px 0px 100%)',
})
.to('.image4',{
  clipPath:'inset(0px 0px 100%)',
}) 

const projects = [...document.querySelectorAll('.project')];

const images = [...document.querySelectorAll('.image')]

let currentColor = '#000';
projects.forEach((p, i) => {
  const color = p.dataset.color;
  gsap.to(p, {
    scrollTrigger: {
      trigger: p,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => {
        gsap.to('body', {
          backgroundColor: color,
          duration: 1,
          ease: 'power4.out'
        });
        currentColor = images[i].dataset.color
        gsap.to(cursor,{
          backgroundColor:images[i].dataset.color,
          duration:.6, 
          ease: 'power4.out'
        })
      },
      onLeave: () => {
        currentColor = '#000'
        gsap.to(cursor,{
          backgroundColor:'#000',
          duration:.6, 
          ease: 'power4.out'
        })
        if( i == projects.length - 1 ){
          gsap.to('body', {
            backgroundColor: '#fff',
            duration: 1,
            ease: 'power4.out'
          });
        }
      },
      onEnterBack: () => {
        currentColor = images[i].dataset.color
        gsap.to(cursor,{
          backgroundColor:images[i].dataset.color,
          duration:.6, 
          ease: 'power4.out'
        })
        gsap.to('body', {
          backgroundColor: color,
          duration: 1,
          ease: 'power4.out'
        });
      },
      onLeaveBack: () => {
        gsap.to(cursor,{
          backgroundColor:'#000',
          duration:.6, 
          ease: 'power4.out'
        })
        if(i==0){
          gsap.to('body', {
            backgroundColor: '#fff',
            duration: 1,
            ease: 'power4.out'
          });
        }
      }
    }
  });
});

const hrWidth = document.querySelector('.hr-inner').getBoundingClientRect().width;

gsap.to('.hr-inner', {
  x:`${-hrWidth}px`,
  scrollTrigger: {
    trigger:'.hr-scroll',
    start:'top top',
    end:`+=${hrWidth}px`,
    scrub:2,
    pin:true,
  }
})

const cardss = [...document.querySelectorAll('.card-hr')];

cardss.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    let x = e.clientX - rect.left - centerX;
    let y = e.clientY - rect.top - centerY;
    y = y*.2
    x = x*.1
    gsap.to(card,{
      x:`${x}px`,
      y:`${y}px`,
      duration:.5,
      ease:'power4.out' 
    })
    
  })
  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      x:0,
      y:0,
      duration:.7,
      ease:'bounce.out'
    })
  })
})
images.forEach((img) => {
  img.addEventListener('mouseenter', () => {
    console.log('mouseenter');
    
    gsap.to('.cursor',{
      width:'8rem',
      height:'8rem',
      backgroundColor:img.dataset.color,
      duration:.6,
      ease:'power4.out'
    })
    gsap.to(cursorText,{
      opacity:1,
      duration:.6,
      ease:'power4.out'
    })
  })
  img.addEventListener('mouseleave', () => {
    gsap.to('.cursor',{
      width:'1.3rem',
      height:'1.3rem',
      backgroundColor:currentColor,
      duration:.6,
      ease:'power4.out'
    })
    gsap.to(cursorText,{
      opacity:0,
      duration:.6,
      ease:'power4.out'
    })
  })
})




document.addEventListener('mousemove', (e) => {
  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration:.7,
    ease:'power4.out'
  })
})
