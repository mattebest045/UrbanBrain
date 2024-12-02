<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body>
<?php
session_start(); // Attivo la sessione
?>

<!-- Menu opzioni Navbar in alto -->
<nav class="navbar navbar-expand-lg">                
    <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="index.html" style="max-width: none !important;">
            <img src="images/logo_scuro.png" class="navbar-brand-image img-fluid" alt="Tiya Golf Club">
            <span class="navbar-brand-text">
                UrbanBrain
                <small>manage your city</small>
            </span>
        </a>

        <!-- Login button da mobile - DEFAULT HIDDEN -->
        <div class="d-lg-none ms-auto me-3">
            <a class="btn custom-btn custom-border-btn" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">Login or Signup</a>
        </div>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-lg-auto">
                <li class="nav-item">
                    <a class="nav-link click-scroll" href="#section_1">Home</a>
                </li>

                <li class="nav-item">
                    <a class="nav-link click-scroll" href="#section_2">About Us</a>
                </li>

                <li class="nav-item">
                    <a class="nav-link click-scroll" href="#section_3">Membership</a>
                </li>

                <li class="nav-item">
                    <a class="nav-link click-scroll" href="#section_4">Events</a>
                </li>

                <li class="nav-item">
                    <a class="nav-link click-scroll" href="#section_5">Contact</a>
                </li>

                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarLightDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">Pages</a>

                    <ul class="dropdown-menu dropdown-menu-light" aria-labelledby="navbarLightDropdownMenuLink">
                        <li><a class="dropdown-item" href="event-listing.html">Event Listing</a></li>

                        <li><a class="dropdown-item" href="event-detail.html">Event Detail</a></li>
                        
                        <li><a class="dropdown-item" href="dashboard.html">Sensor Data</a></li>
                    </ul>
                </li>
            </ul>

            <div class="d-none d-lg-block ms-lg-3">
                <a class="btn custom-btn custom-border-btn" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">Login or Signup</a>
            </div>
        </div>
    </div>
</nav>
</body>
</html>