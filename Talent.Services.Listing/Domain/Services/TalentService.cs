using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Common.Security;
using Talent.Services.Talent.Domain.Contracts;


namespace Talent.Services.Talent.Domain.Services
{
    public class TalentService : ITalentService
    {
        private readonly IRepository<Employer> _employerRepository;
        private readonly IRepository<User> _talentRepository;
        private readonly IRepository<Recruiter> _recruiterRepository;
        private readonly IUserAppContext _userAppContext;
        IFileService _fileService;

        public TalentService(IRepository<Employer> employerRepository,
            IRepository<User> talentRepository,
            IRepository<Recruiter> recruiterRepository,
            IUserAppContext userAppContext,
            IFileService fileService
            )
        {
            _employerRepository = employerRepository;
            _recruiterRepository = recruiterRepository;
            _userAppContext = userAppContext;
            _talentRepository = talentRepository;
            _fileService = fileService;
        }

        public async Task<IEnumerable<string>> GetTalentWatchlistIds(string employerId)
        {
            // First Get's the record of specified employerID and then returns the 'TalentWatchList' field only...
            // throw new NotImplementedException();
            var employer = await _employerRepository.GetByIdAsync(employerId);
            return employer.TalentWatchlist;
        }

        public async Task SetWatchingTalent(string employerId, string talentId, bool isWatching)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        // Add new 'Talent' Record
        public string CreateTalent(User talentData)
        {
            _talentRepository.Add(talentData);
            return talentData.Id;
        }

        // Update the 'Current Record'
        public void UpdateTalent(User talentData)
        {
            _talentRepository.Update(talentData);
        }

        // Get current 'Talent Record' by his ID 
        public async Task<User> GetTalentByIDAsync(string id)
        {
            return await _talentRepository.GetByIdAsync(id);
        }

        // Update 'Country' Field of the 'current user'
        public async Task UpdateTalentCountryAsync(string userId, string userNationality)
        {
            var user = (await GetTalentByIDAsync(userId));

            user.Nationality = userNationality;

            await _talentRepository.Update(user);
        }

        // Add 'Language(s)' Field of the 'current user'
        public async Task AddTalentLanguageAsync(string userId, UserLanguage userLanguages)
        {
            
            var user = (await GetTalentByIDAsync(userId));
            
            UserLanguage userLanguagePartial = new UserLanguage();
            userLanguagePartial.UserId = userId;    
            userLanguagePartial.Language = userLanguages.Language;
            userLanguagePartial.LanguageLevel = userLanguages.LanguageLevel;
            user.Languages.Append(userLanguagePartial);

            await _talentRepository.Update(user);
        }

        // Update 'Language(s)' Field of the 'current user'
        public async Task UpdateTalentLanguageAsync(string userId, UserLanguage userLanguage)
        {
       
            var user = (await GetTalentByIDAsync(userId));

            UserLanguage userLanguageCurrent = user.Languages.FirstOrDefault(l => l.Id == userLanguage.Id);
            userLanguageCurrent.Language = userLanguage.Language;
            userLanguageCurrent.LanguageLevel = userLanguage.LanguageLevel;

            await _talentRepository.Update(user);
        }

        // Delete 'Language(s)' Field of the 'current user' - Flags the entered record as deleted
        public async Task DeleteTalentLanguageAsync(string userId, UserLanguage userLanguage)
        {

            var user = (await GetTalentByIDAsync(userId));

            UserLanguage userLanguageToDelete = user.Languages.FirstOrDefault(l => l.Id == userLanguage.Id);
            userLanguageToDelete.IsDeleted = true;

            await _talentRepository.Update(user);
        }

        // Update 'Linked Accounts' Field of the 'current user'
        public async Task UpdateTalentLinkedAccountsAsync(string userId, LinkedAccounts linkedAccounts)
        {
            var user = (await GetTalentByIDAsync(userId));

            user.LinkedAccounts.LinkedIn = linkedAccounts.LinkedIn;
            user.LinkedAccounts.Github = linkedAccounts.Github;

            await _talentRepository.Update(user);
        }

        // Update 'Description' Field of the 'current user'
        public async Task UpdateTalentDescriptionAsync(string userId, string description)
        {
            var user = (await GetTalentByIDAsync(userId));
            user.Description = description;
            await _talentRepository.Update(user);
        }

        // Update 'Firstname, Lastname, email & phone' Field of the 'current user'
        public async Task UpdateTalentDetailsAsync(string userId, string firstName, string lastName, string email, string phone)
        {
            var user = (await GetTalentByIDAsync(userId));

            user.FirstName = firstName;
            user.LastName = lastName;
            user.Email = email;
            user.Phone = phone;

            await _talentRepository.Update(user);
        }

        // Update 'Address' Field of the 'current user'
        public async Task UpdateTalentAddressAsync(string userId, Address address)
        {
            var user = (await GetTalentByIDAsync(userId));

            user.Address.Number = address.Number;
            user.Address.Street = address.Street;
            user.Address.Suburb = address.Suburb;
            user.Address.City = address.City;
            user.Address.Country = address.Country;
            user.Address.PostCode = address.PostCode;

            await _talentRepository.Update(user);
        }

        // Add 'Skill(s)' Field of the 'current user'
        public async Task AddTalentSkillsAsync(string userId, UserSkill userSkills)
        {

            var user = (await GetTalentByIDAsync(userId));

            UserSkill userSkill = new UserSkill();
            userSkill.UserId = userId;
            userSkill.Skill = userSkills.Skill;
            userSkill.ExperienceLevel = userSkills.ExperienceLevel;

            user.Skills.Append(userSkill);

            await _talentRepository.Update(user);
        }


        // Update 'Skill(s)' Field of the 'current user'
        public async Task UpdateTalentSkillsAsync(string userId, UserSkill userSkill)
        {

            var user = (await GetTalentByIDAsync(userId));

            UserSkill userSkillToUpdate = user.Skills.FirstOrDefault(i => i.Id == userSkill.Id);
            userSkillToUpdate.Skill = userSkill.Skill;
            userSkillToUpdate.ExperienceLevel = userSkill.ExperienceLevel;

            await _talentRepository.Update(user);
        }

        // Delete 'Skill(s)' Field of the 'current user' - Flags the entered record as deleted
        public async Task DeleteTalentSkillsAsync(string userId, UserSkill userSkill)
        {

            var user = (await GetTalentByIDAsync(userId));

            UserSkill userSkillToDelete = user.Skills.FirstOrDefault(i => i.Id == userSkill.Id);
            userSkillToDelete.IsDeleted = true;

            await _talentRepository.Update(user);
        }

        // Add 'Experience(s)' Field of the 'current user'
        public async Task AddTalentExperienceAsync(string userId, UserExperience userExperiences)
        {

            var user = (await GetTalentByIDAsync(userId));

            UserExperience userExperience = new UserExperience();

            userExperience.Company = userExperiences.Company;
            userExperience.Position = userExperiences.Position;
            userExperience.Responsibilities = userExperiences.Responsibilities;
            userExperience.Start = userExperiences.Start;
            userExperience.End = userExperiences.End;

            user.Experience.Append(userExperience);

            await _talentRepository.Update(user);
        }

        // Update 'Experience(s)' Field of the 'current user'
        public async Task UpdateTalentExperienceAsync(string userId, UserExperience userExperience)
        {

            var user = (await GetTalentByIDAsync(userId));

            UserExperience userExperienceCurrent = user.Experience.FirstOrDefault(e => e.Id == userExperience.Id);

            userExperienceCurrent.Company = userExperience.Company;
            userExperienceCurrent.Position = userExperience.Position;
            userExperienceCurrent.Responsibilities = userExperience.Responsibilities;
            userExperienceCurrent.Start = userExperience.Start;
            userExperienceCurrent.End = userExperience.End;

            await _talentRepository.Update(user);
        }

        // Delete 'Experience(s)' Field of the 'current user' -- Removes the actual record
        public async Task DeleteTalentExperienceAsync(string userId, UserExperience userExperience)
        {

            var user = (await GetTalentByIDAsync(userId));

            user.Experience.Remove(user.Experience.FirstOrDefault(e => e.Id == userExperience.Id));

            await _talentRepository.Update(user);
        }

        // Update 'Visa Status' field for the current user
        public async Task UpdateTalentVisaStatusAsync(string userId, string VisaStatus, DateTime? VisaExpiryDate)
        {

            var user = (await GetTalentByIDAsync(userId));

            user.VisaStatus = VisaStatus;
            user.VisaExpiryDate = VisaExpiryDate;

            await _talentRepository.Update(user);
        }

        // Update 'Visa Status' field for the current user
        public async Task UpdateTalentJobSeekingStatusAsync(string userId, JobSeekingStatus jobSeekingStatus)
        {

            var user = (await GetTalentByIDAsync(userId));

            user.JobSeekingStatus.Status = jobSeekingStatus.Status;
            user.JobSeekingStatus.AvailableDate = jobSeekingStatus.AvailableDate;

            await _talentRepository.Update(user);
        }

        // Update / Add Talent Photo
        public async Task<bool> UpdateTalentPhoto(string userId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _talentRepository.Get(x => x.Id == userId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _talentRepository.Update(profile);
                return true;
            }

            return false;

        }


    }
}
