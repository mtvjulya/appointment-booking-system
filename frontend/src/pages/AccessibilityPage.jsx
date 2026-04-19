function AccessibilityPage() {
  return (
    <section className="page-content">
      <div className="container container-narrow">
        <h1>Accessibility</h1>
        <p className="published-date">
          Published on: 01 March 2026 Last updated on: 12 March 2026
        </p>

        <h2>Statement of commitment</h2>
        <p>
          We are committed to making this website accessible in accordance with S.I. 358/2020 
          and the European Accessibility Act.
        </p>
        <p>
          We are committed to achieving AA standard under WCAG 2.1 guidelines.
        </p>
        <p>
          This accessibility statement applies to this website only — not other government 
          websites or subdomains.
        </p>

        <h2>Compliance status</h2>
        <p>
          The native HTML content on this booking system is designed to be compliant with 
          WCAG 2.1 AA guidelines. We strive to ensure that all users, regardless of ability, 
          can access and use the appointment booking service.
        </p>

        <h2>Accessibility features</h2>
        <p>This website has been designed with the following accessibility features:</p>
        <ul className="content-list">
          <li>Semantic HTML structure for screen reader compatibility</li>
          <li>Keyboard navigation support throughout the booking process</li>
          <li>High contrast colour scheme meeting WCAG AA contrast ratios</li>
          <li>Clear, descriptive labels on all form fields</li>
          <li>Focus indicators on interactive elements using the gov.ie gold outline</li>
          <li>Responsive design that works across devices and screen sizes</li>
          <li>Accessibility requirements can be specified during the booking process 
            (wheelchair access, sign language interpreter, large print documents)</li>
        </ul>

        <h2>Non-accessible content</h2>
        <p>
          While we strive for full accessibility, some areas may not yet fully conform:
        </p>
        <ul className="content-list">
          <li>
            <strong>Calendar component:</strong> The date selection calendar may present 
            challenges for screen reader users. We are working to improve ARIA labels 
            and keyboard navigation for this component. (WCAG guideline 1.3.1)
          </li>
          <li>
            <strong>Time slot buttons:</strong> Selected state may not be fully announced 
            by all screen readers. (WCAG guideline 4.1.2)
          </li>
          <li>
            <strong>Documents:</strong> Any uploaded or referenced documents are not be fully accessible. (WCAG guideline 1.1.1)
          </li>
        </ul>

        <h2>How we test this website</h2>
        <p>
          We use the WCAG level AA guidelines to test how accessible this booking system is. 
          We follow the Website Accessibility Conformance Evaluation Methodology (WCAG-EM) 
          approach to assess the site.
        </p>
        <p>
          Testing includes manual keyboard navigation testing, and screen reader compatibility checks.
        </p>

        <h2>Feedback and contact information</h2>
        <p>
          If you experience any difficulty accessing content or using features on this website, 
          or if you have suggestions for improving accessibility, please contact us.
        </p>
        <p>
          We take accessibility feedback seriously and will work to address any issues raised.
        </p>

        <div className="card card-bg-grey" style={{ marginTop: '1.5rem' }}>
          <p style={{ margin: 0 }}>
            <strong>Contact:</strong> <a className="link-green" href="mailto:yulia.reutova.email@gmail.com">yulia.reutova.email@gmail.com</a>
          </p>
        </div>

      </div>
    </section>
  );
}

export default AccessibilityPage;