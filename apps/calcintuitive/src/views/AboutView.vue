<template>
  <div class="about">
    <h1 v-voix="'AboutTitle'">About CalcIntuitive</h1>
    
    <div class="about-content">
      <section class="about-section">
        <h2 v-voix="'FeaturesTitle'">Features</h2>
        <ul>
          <li>Dynamic input canvas that adapts to your calculation needs</li>
          <li>Contextual suggestions to help guide your calculations</li>
          <li>Multiple calculation modes: Standard, Symbolic, Matrix, and Calculus</li>
          <li>Interactive graphing capabilities</li>
          <li>Intuitive user interface with smooth transitions between modes</li>
        </ul>
      </section>
      
      <section class="about-section">
        <h2 v-voix="'HowToUseTitle'">How to Use</h2>
        <ol>
          <li>Start typing your calculation in the input field</li>
          <li>Use the tool buttons to add functions and symbols</li>
          <li>View contextual suggestions based on your input</li>
          <li>Switch between calculation modes as needed</li>
          <li>Visualize functions with the graphing capabilities</li>
        </ol>
      </section>
      
      <section class="about-section">
        <h2 v-voix="'CalculationModesTitle'">Calculation Modes</h2>
        <dl>
          <dt>Standard</dt>
          <dd>Basic arithmetic operations and common mathematical functions.</dd>
          
          <dt>Symbolic</dt>
          <dd>Solve equations, simplify expressions, and perform symbolic manipulations with variables.</dd>
          
          <dt>Matrix</dt>
          <dd>Create and manipulate matrices with operations like determinant, inverse, and transpose.</dd>
          
          <dt>Calculus</dt>
          <dd>Calculate derivatives, integrals, limits, and more for calculus problems.</dd>
          
          <dt>Graphing</dt>
          <dd>Visualize mathematical functions with an interactive graphing tool.</dd>
        </dl>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
  color: var(--color-heading);
  font-size: 2rem;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.about-section {
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--color-heading);
  font-size: 1.5rem;
}

ul, ol {
  margin: 0;
  padding-left: 1.5rem;
}

li {
  margin-bottom: 0.5rem;
}

dl {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 0.75rem;
}

dt {
  font-weight: bold;
}

dd {
  margin: 0;
}

@media (min-width: 1024px) {
  .about {
    padding: 3rem;
  }
}
</style>
