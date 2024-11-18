<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">

        <title>UrbanBrain</title>

        <!-- CSS FILES -->                
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap" rel="stylesheet">
        <link href="css/bootstrap.min.css" rel="stylesheet">
        <link href="css/bootstrap-icons.css" rel="stylesheet">
        <link href="css/template-urbanbrain.css" rel="stylesheet">

        <!-- Icona predefinita -->
        <link id="theme-icon" rel="icon" href="images/logo_scuro.png" type="image/gif" sizes="16x16">

        <script>
        // GESTIONE ICONA TITOLO PAGINA ------------------------------------------------------------
        function updateFavicon() {
            const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const iconLink = document.getElementById('theme-icon');
            
            if (isDarkMode) {
            iconLink.href = 'images/logo_chiaro.png'; // Icona chiara per dark mode
            } else {
            iconLink.href = 'images/logo_scuro.png'; // Icona scura per light mode
            }
        }
        updateFavicon();
        // Rileva cambiamenti nella modalità tema e aggiorna l'icona
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);
        //------------------------------------------------------------------------------------------

        
        //------------------------------------------------------------------------------------------
        </script>
    </head>
    
    <body style="background-color: #3D405B;">
        <main>

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
                </div>
            </nav>

            <!-- Login os Signup utente -->
            
            
            <!-- Pagina inziale di presentazione -->
            <section class="hero-section signup-hero-section d-flex justify-content-center align-items-center" id="section_1">

                <div class="container">
                    <div class="row pl-30-perc pr-30-perc">
                        <h2 class="text-white">[LIVELLO UTENTE] Sign Up</h2>
                        <div class="signup-box-php">
                            <div class="offcanvas-body d-flex flex-column">
                                <form class="custom-form member-login-form" action="signup_test.php" method="get" role="form">

                                    <div class="member-login-form-body">
                                        <div class="mb-4">
                                            <label class="form-label mb-2" for="member-signup-name">Name</label>

                                            <input type="text" name="member-signup-name" id="memember-signup-name" class="form-control" placeholder="Name" required="">
                                        </div>

                                        <div class="mb-4">
                                            <label class="form-label mb-2" for="member-signup-surname">Surname</label>

                                            <input type="text" name="member-signup-surname" id="memember-signup-surname" class="form-control" placeholder="Surname" required="">
                                        </div>

                                        <div class="mb-4">
                                            <label class="form-label mb-2" for="member-signup-birthday">Birthday</label>

                                            <input type="date" name="member-signup-birthday" id="member-signup-birthday" class="form-control" required="">
                                        </div>

                                        <div class="mb-4">
                                            <label class="form-label mb-2" for="member-signup-email">Personal email</label>

                                            <input type="email" name="member-signup-email" id="member-signup-email" class="form-control" placeholder="Personal email" required="">
                                        </div>

                                        <div class="mb-4">
                                            <label class="form-label mb-2" for="member-signup-wemail">Work email</label>

                                            <input type="email" name="member-signup-wemail" id="member-signup-wemail" class="form-control" placeholder="Work email" required="">
                                        </div>

                                        <div class="mb-4">
                                            <label class="form-label mb-2" for="member-signup-password">Password</label>

                                            <input type="email" name="member-signup-password" id="member-signup-password" class="form-control" placeholder="Password" required="">
                                        </div>

                                        <div class="mb-4">
                                            <label class="form-label mb-2" for="member-signup-phone">Phone</label>

                                            <input type="tel" name="member-signup-phone" id="member-signup-phone" class="form-control" placeholder="Phone number" required="">
                                        </div>

                                        <div class="mb-4">
                                            <label class="form-label mb-2" for="member-signup-address">Address</label>

                                            <input type="text" name="member-signup-address" id="member-signup-address" class="form-control" placeholder="Full address" required="">
                                        </div>
                                        
                                        <div class="mb-4">
                                            <label class="form-label mb-2" for="member-signup-job">Job area</label>

                                            <input type="text" name="member-signup-job" id="member-signup-job" class="form-control" placeholder="Job" required="">
                                        </div>
                                        
                                        <div class="mb-4">
                                            <label class="form-label mb-2" for="member-signup-task">Task</label>

                                            <input type="text" name="member-signup-task" id="member-signup-task" class="form-control" placeholder="Task" required="">
                                        </div>
                                        
                                        <div class="col-lg-5 col-md-7 col-8 mx-auto">
                                            <button type="submit" class="form-control">Sign Up</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>

            </section>

            <!-- Paragrafo di presentazioni team -->
            

            <!-- Paragrafo newsletter -->
            

            <!-- Paragrafo gestione nuovi utenti -->


            <!-- Paragrafo elenco eventi -->
            

            <!-- Paragrafo domande -->
            
        </main>


        <!-- JAVASCRIPT FILES -->
        <script src="js/jquery.min.js"></script>
        <script src="js/bootstrap.bundle.min.js"></script>
        <script src="js/jquery.sticky.js"></script>
        <script src="js/click-scroll.js"></script>
        <script src="js/animated-headline.js"></script>
        <script src="js/modernizr.js"></script>
        <script src="js/custom.js"></script>

    </body>
</html>