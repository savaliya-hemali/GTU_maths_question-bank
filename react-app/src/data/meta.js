// GTU Mathematics — Subject & Unit Metadata
export const BASE_META = {
  m1: {
    name: "Mathematics 1",
    shortName: "Maths 1",
    semester: 1,
    code: "BE01R00041 / 3110014",
    eyebrow: "GTU  ·  SEMESTER I  ·  SUBJECT CODE: BE01R00041 (w.e.f. 2025-26) / 3110014, 110008 (earlier)",
    units: {
      1: {
        title: "Basic Calculus",
        icon: "📐",
        desc: "Improper integrals (Type I & II), Beta and Gamma functions and their properties, applications of definite integrals to evaluate surface areas and volumes of revolution",
        weight: 20,
      },
      2: {
        title: "Single-variable Calculus (Differentiation)",
        icon: "📈",
        desc: "Taylor's and Maclaurin's theorem for a function of one variable, Taylor's and Maclaurin's series, extreme values of functions, indeterminate forms and L'Hospital's rule",
        weight: 16,
      },
      3: {
        title: "Sequences and Series",
        icon: "🔢",
        desc: "Sequence of numbers and its convergence, infinite series, tests for convergence, alternating series test, power series — radius and interval of convergence",
        weight: 20,
      },
      4: {
        title: "Multivariable Calculus (Differentiation)",
        icon: "🌐",
        desc: "Limit, continuity and differentiation for functions of two or more variables, total derivative, gradient, directional derivatives, tangent plane and normal line, extreme values, Lagrange multipliers",
        weight: 22,
      },
      5: {
        title: "Multivariable Calculus (Integration)",
        icon: "📦",
        desc: "Multiple integration: double integrals (Cartesian, polar), change of order of integration, change of variables, areas and volumes, triple integrals",
        weight: 22,
      },
    },
  },
  m2: {
    name: "Mathematics 2",
    shortName: "Maths 2",
    semester: 2,
    code: "BE02R00011 / 3110015",
    eyebrow: "GTU  ·  SEMESTER II  ·  SUBJECT CODE: BE02R00011 (w.e.f. 2025-26) / 3110015 (earlier)",
    units: {
      1: {
        title: "Matrices",
        icon: "🔲",
        desc: "Linear independence, row/reduced row echelon form, rank, inverse via Gauss-Jordan, solving linear systems, eigenvalues and eigenvectors, diagonalization, inverse via Cayley-Hamilton theorem",
        weight: 20,
      },
      2: {
        title: "First-order Ordinary Differential Equations",
        icon: "💧",
        desc: "Exact differential equations, integrating factors for non-exact equations, linear and Bernoulli's equations, equations solvable for p, y, x, and Clairaut's type",
        weight: 15,
      },
      3: {
        title: "Higher-order Ordinary Differential Equations",
        icon: "🏗️",
        desc: "Linear ODEs with constant/variable coefficients, Euler-Cauchy equations, variation of parameters, undetermined coefficients, classification of ordinary/singular points, power series solutions",
        weight: 25,
      },
      4: {
        title: "Complex Variables (Differentiation)",
        icon: "🔷",
        desc: "Differentiation, Cauchy-Riemann equations, analytic functions, harmonic functions, harmonic conjugate, analyticity of elementary functions",
        weight: 20,
      },
      5: {
        title: "Complex Variables (Integration)",
        icon: "🌀",
        desc: "Contour integrals, Cauchy-Goursat theorem, Cauchy integral formula, Taylor's series, singularities, Laurent's series, residues, Cauchy residue theorem, Rouche's theorem",
        weight: 20,
      },
    },
  },
  ps: {
    name: "Probability & Statistics",
    shortName: "P & S",
    semester: 3,
    code: "3130006 / BE03000251",
    eyebrow: "GTU  ·  SEMESTER III / IV  ·  SUBJECT CODE: 3130006 / BE03000251",
    units: {
      1: {
        title: "Basic Probability & Discrete Distributions",
        icon: "🎲",
        desc: "Probability spaces, conditional probability, Bayes' Theorem, discrete random variables, probability mass functions, expectation, variance, Binomial and Poisson distributions",
        weight: 20,
      },
      2: {
        title: "Continuous Distributions & Expectation",
        icon: "📊",
        desc: "Continuous random variables, probability density functions, cumulative distribution functions, Uniform, Exponential, Normal distributions, expectation, moment generating functions",
        weight: 20,
      },
      3: {
        title: "Correlation, Regression & Skewness",
        icon: "📉",
        desc: "Bivariate distributions, joint PMF/PDF, covariance, Karl Pearson coefficient of correlation, Spearman rank correlation, linear regression lines, moments, skewness, kurtosis",
        weight: 20,
      },
      4: {
        title: "Applied Statistics & Hypothesis Testing",
        icon: "🧪",
        desc: "Sampling distributions, standard error, test of hypothesis, Z-test for mean & proportion, Student's t-test, Chi-square test for goodness of fit & independence, F-test, ANOVA",
        weight: 25,
      },
      5: {
        title: "Curve Fitting & Method of Least Squares",
        icon: "📐",
        desc: "Fitting straight lines, second degree parabolas, exponential curves (y = a·bˣ, y = a·xᵇ), method of least squares, normal equations",
        weight: 15,
      },
    },
  },
  dm: {
    name: "Discrete Mathematics",
    shortName: "Discrete Maths",
    semester: 4,
    code: "BE04000261 / 3140708",
    eyebrow: "GTU  ·  SEMESTER IV  ·  SUBJECT CODE: BE04000261 / 3140708",
    units: {
      1: {
        title: "Propositional & Predicate Logic",
        icon: "🧠",
        desc: "Propositional logic, truth tables, tautologies, connectives, statement formulas, normal forms (DNF/PDNF), predicate logic, quantifiers, free & bound variables, valid arguments",
        weight: 18,
      },
      2: {
        title: "Set Theory, Combinatorics & Recurrence",
        icon: "🔢",
        desc: "Set theory operations & identities, counting principles, permutations & combinations, pigeonhole principle, inclusion-exclusion principle, recurrence relations",
        weight: 11,
      },
      3: {
        title: "Functions & Algebraic Structures",
        icon: "⚙️",
        desc: "Injective/surjective/bijective functions, composition, inverses, groups, subgroups, cyclic groups, cosets, Lagrange's theorem, homomorphism, rings, integral domains & fields",
        weight: 22,
      },
      4: {
        title: "Relations, Partial Ordering & Lattices",
        icon: "🔗",
        desc: "Binary relations, reflexive/symmetric/transitive properties, equivalence relations & classes, Hasse diagrams, POSETs, maximal/minimal elements, LUB/GLB, lattices & Boolean algebra",
        weight: 22,
      },
      5: {
        title: "Graphs & Trees",
        icon: "🌐",
        desc: "Graphs, degree sequence, handshaking lemma, paths, cycles, reachability, connectedness, Warshall's algorithm, trees, binary trees, tree traversals, MST & graph matrices",
        weight: 27,
      },
    },
  },
};

export const META = BASE_META;

export const SEMESTERS = [
  { id: 1, label: "Semester 1", short: "Sem 1" },
  { id: 2, label: "Semester 2", short: "Sem 2" },
  { id: 3, label: "Semester 3", short: "Sem 3" },
  { id: 4, label: "Semester 4", short: "Sem 4" },
  { id: 5, label: "Semester 5", short: "Sem 5" },
  { id: 6, label: "Semester 6", short: "Sem 6" },
  { id: 7, label: "Semester 7", short: "Sem 7" },
  { id: 8, label: "Semester 8", short: "Sem 8" },
];

const STORAGE_KEY = "gtu:custom_subjects";

export function loadCustomSubjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveCustomSubjects(customSubjects) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customSubjects));
  } catch {
    // ignore
  }
}

