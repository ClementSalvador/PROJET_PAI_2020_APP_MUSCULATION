package fr.univ.lille.fil.mbprestservice.controller;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import fr.univ.lille.fil.mbprestservice.dto.AccessTokenDTO;
import fr.univ.lille.fil.mbprestservice.dto.AuthenticationResponseDTO;
import fr.univ.lille.fil.mbprestservice.entity.Salle;
import fr.univ.lille.fil.mbprestservice.entity.User;
import fr.univ.lille.fil.mbprestservice.entity.UserPasswordReset;
import fr.univ.lille.fil.mbprestservice.exceptions.EmailAlreadyExistException;
import fr.univ.lille.fil.mbprestservice.exceptions.InvalidRefreshTokenException;
import fr.univ.lille.fil.mbprestservice.exceptions.NoAccountFoundException;
import fr.univ.lille.fil.mbprestservice.requestbody.AuthenticationRequest;
import fr.univ.lille.fil.mbprestservice.requestbody.CreateUserBody;
import fr.univ.lille.fil.mbprestservice.requestbody.ResetPasswordBody;
import fr.univ.lille.fil.mbprestservice.service.MailService;
import fr.univ.lille.fil.mbprestservice.service.SalleService;
import fr.univ.lille.fil.mbprestservice.service.UserService;

/**
 * Classe controller qui reçoit les requêtes REST liées à l'utilisateur 
 * @author Anthony Bliecq
 *
 */
@CrossOrigin
@RestController
public class UserController {

	@Autowired
	private UserService userService;
	@Autowired
	private SalleService salleService;

	@Autowired
	private AuthenticationManager authenticationManager;


	/**
	 * Récupère tous les utilisateurs enregistrés
	 * @return
	 */
	@GetMapping("/getAllUsers")
	public List<User> getAllUsers(){
		return this.userService.findAll();
	}

	/**
	 * Authentifie un utilisateur en contrôlant le mot de passe et l'identifiant
	 * @param request
	 * @return
	 */
	@PostMapping("/login")
	public AuthenticationResponseDTO createAuthenticationToken(@RequestBody AuthenticationRequest request) {

		authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
		return userService.login(request.getUsername());
	}



	/**
	 * Génère un nouveau access-token pour l'utilisateur grâce au refresh-token
	 * @param token
	 * @return
	 */
	@PostMapping("/refresh/{token}")
	public AccessTokenDTO tokenPostRefresh(@PathVariable(value = "token") final String token) {
		AccessTokenDTO dto = userService.refreshAccessToken(token).orElse(null);
		if (dto == null)
			throw new InvalidRefreshTokenException();
		return dto;
	}

	
	/**
	 * Supprime l'access token ainsi que le refresh-token d'un utilisateur (logout)
	 * @param token
	 */
	@DeleteMapping("/revoke/{token}")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void tokenDeleteLogout(@PathVariable(value="token") final String token) {
		userService.logoutUser(token);
	}


	/**
	 * Génère un token pour le mot de passe oublié afin de pouvoir saisir un nouveau mot de passe
	 * @param email
	 * @return
	 */
	@PostMapping("/createPasswordToken/{email}")
	public ResponseEntity<String> createPasswordToken(@PathVariable(value = "email") final String email) {
		User user = (User) userService.loadUserByUsername(email);
		if (user == null) {
			throw new NoAccountFoundException();
		}
		String token = userService.createResetPasswordToken(user.getUsername());
		String object = "Réinitialisation de votre mot de passe";
		String message = "Bonjour " + user.getPrenom() + " " + user.getNom() + ", \n\n"
				+ "Le lien ci-dessous vous permet de réinitialiser votre mot de passe : " + "\n\n"
				+ "http://localhost:4200/resetPassword?token=" + token;
		sendMail(user, object, message);

		return new ResponseEntity<>("{ \"message\": \"password reset token created successfull\" }", HttpStatus.OK);

	}

	/**
	 * verfifie que le token lié au mot de passe est valide
	 * @param token
	 * @return
	 */
	@GetMapping("/isValidPasswordToken/{token}")
	public ResponseEntity<String> isValidPasswordToken(@PathVariable(value = "token") final String token) {
		userService.loadUserWithPasswordResetToken(token);
		return new ResponseEntity<>("{ \"message\": \"valid token\" }", HttpStatus.OK);

	}

	/**
	 * Permet d'attribuer un nouveau mot de passe à un utilisateur qui a perdu le sien 
	 * @param token
	 * @param reset
	 * @return
	 */
	@PutMapping("/resetPasswordWithToken/{token}")
	public ResponseEntity<String> resetPasswordWithToken(@PathVariable(value = "token") final String token,
			@RequestBody ResetPasswordBody reset) {
		UserPasswordReset userPassword = userService.loadUserWithPasswordResetToken(token);
		User user = (User) userService.loadUserByUsername(userPassword.getUsername());
		userService.resetPassword(user, reset.getPassword());
		String object = "Mot de passe réinitialisé";
		String message = "Votre mot de passe a été correctement réinitialisé ";
		sendMail(user, object, message);

		return new ResponseEntity<>("{ \"message\": \"password reset successfull\" }", HttpStatus.OK);

	}

	/**
	 * Fonction envoyant un mail
	 * @param user le destinataire
	 * @param object l'objet du message
	 * @param message le message
	 */
	private void sendMail(User user, String object, String message) {
		new Thread(new MailService(user.getUsername(), object, message)).start();
	}

	/**
	 * récupère un utilisateur grâce à son identifiant
	 * @param userId
	 * @return
	 */
	@GetMapping("/getUser")
	public User getUser(String userId) {
		return userService.findUserById(userId);
	}

	/**
	 * enregistre un utilisateur lors de l'inscription
	 * @param body
	 * @return
	 */
	// save a user
	@PostMapping("/user")
	public User createUser(@Valid @RequestBody CreateUserBody body) {
		User user = mapFromDto(body);
		if (userService.loadUserByUsername(user.getUsername()) != null) {
			throw new EmailAlreadyExistException();
		}

		String object = "Confirmation Inscription MyBodyPartner";
		String message = "Bonjour " + user.getPrenom() + " " + user.getNom() + ", \n\n"
				+ "Nous vous confirmons votre inscription à l'application MyBodyPartner.";
		this.sendMail(user, object, message);
		return userService.save(user);

	}

	/**
	 * Mets à jour les informations d'un utilisateur
	 * @param body
	 * @return
	 */
	//update user information
	@Transactional
	@PutMapping("/updateUser")
	public int updateUser(@Valid @RequestBody CreateUserBody body) {
		User user = mapFromDto(body);
		return userService.updateUser(user);
	}

	/**
	 * Permet d'associer le contenu d'un body d'une requête à une entite
	 * @param body
	 * @return
	 */
	// a redefinir peut etre dans une couche business ou converter
	private User mapFromDto(CreateUserBody body) {
		User user = new User();
		user.setAdresse(body.getAdresse());
		user.setBornDate(body.getBornDate());
		user.setUsername(body.getUsername());
		user.setNom(body.getNom());
		user.setPassword(body.getPassword());
		user.setPrenom(body.getPrenom());
		user.setSexe(body.getSexe());
		user.setRole(body.getRole());
		Salle salle = salleService.findById(body.getSid()).orElse(null);
		user.setSid(salle);

		return user;
	}
	
	/**
	 * Supprime un utilisateur 
	 * @param username
	 * @return
	 */
	//cancel user account by deleting this user
	@Transactional
	@DeleteMapping("/cancelUserAccount")
	public int cancelUserAccount(String username) {
		return userService.cancelUserAccount(username);
	}
	
	/**
	 * Récupère tous les utilisateurs ne figurant pas parmi la liste de contacts de l'utilisateur donné (utilisateur lui-même non renvoyé)
	 * @param pid
	 * @return
	 */
	@GetMapping("/getAllUsersExceptFriendsAndMe/{pid}")
	public List<User> getAllUsersExceptFriendsAndMe(@PathVariable(name = "pid") int pid){
		return this.userService.getUserNotInFriendList(pid);
	}

}

