<template>
  <div class="image-art-wrapper">
    <div class="frame">
      <img :src="src" :alt="alt" class="art-image" />
    </div>
    <div class="art-info" :class="{ visible: showInfo }">
      <h3 class="art-name">{{ name }}</h3>
      <p class="art-desc">{{ desc }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: 'Unknown Art'
  },
  desc: {
    type: String,
    default: ''
  },
  showInfo: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.image-art-wrapper {
  position: relative;
  width: 100%;
  height: auto;
  /* Ensure the hover area includes the image */
}

/* ... existing frame/image styles ... */

.frame {
  width: 100%;
  height: auto;
  background-color: #121212; /* Dark matte background */
  border: 12px solid #000; /* The frame */
  outline: 1px solid #333; /* Slight highlight on frame edge */
  box-sizing: border-box; /* Ensure border is included in width */
  position: relative;
  z-index: 1; /* Image is base layer */
}

.art-image {
  width: 100%;
  height: auto;
  display: block;
}

.art-info {
  position: absolute;
  top: 50%;
  left: 80%; /* Position to the right of the image */
  transform: translateY(-50%) translateX(20px); /* Center vertically relative to image, add spacing */
  width: auto; /* Fixed width for the info box */
  padding: 2em;
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid #444;
  color: #fff;
  border-radius: 4px;
  pointer-events: none; /* Let clicks pass through if needed, though mostly visual */
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: 0; /* Ensure it's above other things locally */
  
  /* Text styling */
  text-align: left;
  font-family: 'Courier New', Courier, monospace; /* somewhat retro/code look */
}

.art-info.visible {
  opacity: 1;
  transform: translateY(-50%) translateX(75%); /* Slight movement when visible */
}

.art-name {
  margin: 0 0 0.5rem 0;
  font-size: 3rem;
  font-weight: bold;
  color: #ff0055; /* Accent color, adjusting based on vibe */
  text-transform: uppercase;
  letter-spacing: 5px;
  white-space: nowrap;
}

.art-desc {
  margin: 0;
  font-size: 2rem;
  line-height: 1.4;
  color: #ccc;
  white-space: nowrap;
}
</style>
