<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  code: {
    type: String,
    required: true,
    default: ''
  },
  language: {
    type: String,
    required: true,
    default: 'javascript'
  }
});

// Reference to iframe element
const iframeRef = ref(null);
const error = ref(null);

function updatePreview() {
  if (!iframeRef.value) return;
  
  try {
    // Build appropriate HTML content
    let content = '';
    
    if (!props.code || !props.code.trim()) {
      content = createEmptyPreview();
    } else if (props.language === 'html') {
      content = props.code;
    } else if (props.language === 'javascript') {
      content = createJsPreview();
    } else if (props.language === 'css') {
      content = createCssPreview();
    } else {
      content = createEmptyPreview();
    }
    
    // Set iframe content using the srcdoc attribute
    iframeRef.value.srcdoc = content;
  } catch (err) {
    console.error('Error updating preview:', err);
    error.value = err.message;
  }
}

function createJsPreview() {
  return [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '<meta charset="utf-8">',
    '<title>JS Preview</title>',
    '</head>',
    '<body>',
    '<div id="output"></div>',
    '<script>',
    'try {',
    props.code,
    '} catch(e) {',
    'document.getElementById("output").innerHTML="<div style=\\"color:red;font-family:monospace;white-space:pre-wrap\\">Error: " + e.message + "</div>";',
    '}',
    '\<\/script>',
    '</body>',
    '</html>'
  ].join('');
}

function createCssPreview() {
  return [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '<meta charset="utf-8">',
    '<title>CSS Preview</title>',
    '<style>',
    props.code,
    '</style>',
    '</head>',
    '<body>',
    '<div style="padding:20px">',
    '<h1>CSS Preview</h1>',
    '<p>Paragraph text</p>',
    '<button>Button</button>',
    '<div class="box">Box element</div>',
    '<ul><li>List item</li><li>List item</li></ul>',
    '</div>',
    '</body>',
    '</html>'
  ].join('');
}

function createEmptyPreview() {
  return [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '<meta charset="utf-8">',
    '<title>Preview</title>',
    '<style>',
    'body{font-family:system-ui;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#f5f5f5;color:#666}',
    '</style>',
    '</head>',
    '<body>',
    '<div style="text-align:center">Enter code to see preview</div>',
    '</body>',
    '</html>'
  ].join('');
}

// Watch for changes to update the preview
watch(() => props.code, updatePreview);
watch(() => props.language, updatePreview);

onMounted(() => {
  // Set up iframe once mounted
  setTimeout(updatePreview, 100);
});
</script>

<template>
  <div class="preview-panel">
    <iframe 
      ref="iframeRef" 
      class="preview-frame" 
      sandbox="allow-scripts"
      v-voix="'preview-frame'"
    ></iframe>
  </div>
</template>

<style scoped>
.preview-panel {
  flex: 1;
  min-height: 40vh;
  overflow: hidden;
  border-top: 1px solid var(--border-color);
}

@media (min-width: 768px) {
  .preview-panel {
    border-top: none;
    border-left: 1px solid var(--border-color);
  }
}

.preview-frame {
  width: 100%;
  height: 100%;
  border: none;
  background-color: white;
}
</style>