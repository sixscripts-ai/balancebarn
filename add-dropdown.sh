#!/bin/bash

# Script to add dropdown menu to all pages

PAGES=(
    "public/pages/company-overview.html"
    "public/pages/meet-team.html"
    "public/pages/services-portfolio.html"
    "public/pages/services-pricing.html"
    "public/pages/services-complete.html"
    "public/pages/contact.html"
    "public/pages/assessment.html"
)

DROPDOWN_HTML='                    <li class="dropdown">
                        <button class="dropdown-toggle" onclick="toggleDropdown(event)">
                            All Pages <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-content">
                            <a href="../index.html">Home</a>
                            <a href="about.html">About (Original)</a>
                            <a href="team-story.html">Team Story</a>
                            <a href="company-overview.html">Company Overview</a>
                            <a href="meet-team.html">Meet the Team</a>
                            <a href="services.html">Services (Original)</a>
                            <a href="services-portfolio.html">Services Portfolio</a>
                            <a href="services-pricing.html">Services \& Pricing</a>
                            <a href="services-complete.html">Services Complete</a>
                            <a href="contact.html">Contact</a>
                            <a href="assessment.html">Assessment</a>
                        </div>
                    </li>'

DROPDOWN_JS='    <script>
        // Dropdown toggle function
        function toggleDropdown(event) {
            event.stopPropagation();
            const dropdown = event.target.closest('\''.dropdown'\'');
            dropdown.classList.toggle('\''active'\'');
        }

        // Close dropdown when clicking outside
        document.addEventListener('\''click'\'', function(event) {
            const dropdowns = document.querySelectorAll('\''.dropdown'\'');
            dropdowns.forEach(dropdown => {
                if (!dropdown.contains(event.target)) {
                    dropdown.classList.remove('\''active'\'');
                }
            });
        });
    </script>'

for page in "${PAGES[@]}"; do
    echo "Processing $page..."

    # Check if dropdown already exists
    if grep -q "dropdown-toggle" "$page"; then
        echo "  Dropdown already exists in $page, skipping..."
        continue
    fi

    # Add dropdown to nav menu - find the closing </ul> and add before it
    if grep -q "</ul>" "$page"; then
        # Use a more careful sed approach - add the dropdown before </ul>
        sed -i.bak '/<\/ul>/i\
'"$DROPDOWN_HTML"'
' "$page"
        echo "  Added dropdown menu to $page"
    fi

    # Add JavaScript before </body>
    if grep -q "</body>" "$page"; then
        sed -i.bak2 '/<\/body>/i\
'"$DROPDOWN_JS"'
' "$page"
        echo "  Added JavaScript to $page"
    fi
done

echo "Done! Dropdown added to all pages."
