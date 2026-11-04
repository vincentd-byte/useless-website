
const wheel = document.getElementById("wheel");
const spokes = document.getElementById("spokes");

const generationNumber = document.getElementById("generationNumber");
const speedNumber = document.getElementById("speedNumber");

let rotation = 0;
let speed = 0;
let lastTime = performance.now();

let isHovering = false;
let isLaunching = false;
let colourVersion = 0;

// CREATE FIVE WHEEL SPOKES

for (let i = 0; i < 5; i++) {
    const spoke = document.createElement("div");

    spoke.className = "spoke";
    spoke.style.transform = `rotate(${i * 72}deg)`;

    spokes.appendChild(spoke);
}

// HOVER TO SPIN

wheel.addEventListener("pointerenter", () => {
    if (!isLaunching) {
        isHovering = true;
    }
});

wheel.addEventListener("pointerleave", () => {
    isHovering = false;
});

// CHANGE WHEEL COLOUR

function changeWheelColour() {
    colourVersion++;

    wheel.classList.remove(
        "variant-1",
        "variant-2",
        "variant-3"
    );

    wheel.classList.add(
        `variant-${((colourVersion - 1) % 3) + 1}`
    );
}

// LAUNCH WHEEL WHEN CLICKED

function launchWheel() {
    if (isLaunching) return;

    isLaunching = true;
    isHovering = false;

    changeWheelColour();

    wheel.style.setProperty(
        "--launch-rotation",
        `${rotation}deg`
    );

    wheel.classList.add("launching");
}

// MOUSE CLICK

wheel.addEventListener("click", launchWheel);

// KEYBOARD ACCESSIBILITY

wheel.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        launchWheel();
    }
});

// RESET AFTER LAUNCH

wheel.addEventListener("animationend", (event) => {
    if (event.animationName !== "wheelLaunch") return;

    wheel.classList.remove("launching");

    // Keep the wheel's current rotation
    wheel.style.transform =
        `translate(-50%, -50%) rotate(${rotation}deg)`;

    speed = 0;
    isLaunching = false;
});

// MAIN ANIMATION

function animate(time) {
    const delta = Math.min(time - lastTime, 50);

    lastTime = time;

    if (!isLaunching) {

        // TARGET SPEED WHEN HOVERING
        const targetSpeed = isHovering ? 1.2 : 0;

        // SMOOTH ACCELERATION AND DECELERATION
        const easing = isHovering ? 0.004 : 0.002;

        speed += (targetSpeed - speed) *
            (1 - Math.exp(-easing * delta));

        // ROTATE WHEEL
        rotation += speed * delta;

        wheel.style.transform =
            `translate(-50%, -50%) rotate(${rotation}deg)`;

        // UPDATE SPIN COUNTER
        generationNumber.textContent =
            Math.floor(Math.abs(rotation) / 360);

        // DISPLAY SPEED
        speedNumber.textContent =
            Math.round(speed * 1000);
    }

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
