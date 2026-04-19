function AboutPage() {
  return (
    <section className="page-content">
      <div className="container container-narrow">
        <h1>About the Appointment Booking System</h1>
        <p className="published-date">
          Published on: 01 March 2026 Last updated on: 11 March 2026
        </p>

        <p>
          The Appointment Booking System for Government Services is a centralised platform 
          designed to simplify and streamline the process of scheduling appointments with 
          Irish government departments and agencies.
        </p>

        <p>
          Inspired by <a href="https://www.gov.ie" target="_blank" rel="noopener noreferrer">gov.ie</a>, 
          this system combines appointment services from multiple government bodies into a single, 
          trusted source — making interactions with the government more user-focused and efficient.
        </p>

        <h2>Purpose of The Appointment Booking System</h2>
        <p>
          The aim of this system is to present appointment booking in a clear, understandable, 
          and accessible manner — reducing wait times, eliminating phone queues, and giving 
          citizens full control over when and where they attend government services.
        </p>

        <h2>Services available</h2>
        <p>This system currently supports appointment booking for:</p>
        <ul className="content-list">
          <li><strong>NDLS</strong> — Driving Licence and Learner Permit applications</li>
          <li><strong>Passport Office</strong> — New passport and renewal appointments</li>
          <li><strong>Social Welfare (Intreo)</strong> — Meetings with case officers</li>
          <li><strong>Immigration (IRP)</strong> — Irish Residence Permit registration</li>
          <li><strong>Revenue</strong> — Tax consultation appointments</li>
        </ul>

        <h2>How it works</h2>
        <ol className="content-list">
          <li>Select the government service you need</li>
          <li>Provide your personal details and accept the Terms and Conditions</li>
          <li>Choose a service centre convenient to you</li>
          <li>Pick a date and time from the available calendar slots</li>
          <li>Confirm your booking and receive a confirmation</li>
        </ol>

        <h2>About this project</h2>
        <p>
          This system is operated as a diploma project by Yulia Reutova. It is a prototype 
          booking system for educational purposes and is not affiliated with the Irish Government 
          or any government department.
        </p>
        <p>
          The design and user experience are inspired by 
          the <a href="https://www.gov.ie" target="_blank" rel="noopener noreferrer">gov.ie</a> platform 
          and the <a href="https://www.ndls.ie" target="_blank" rel="noopener noreferrer">NDLS</a> booking 
          system to demonstrate best practices in public service digital design.
        </p>
      </div>
    </section>
  );
}

export default AboutPage;